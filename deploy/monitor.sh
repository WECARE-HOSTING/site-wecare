#!/usr/bin/env bash
# Monitor do site WeCare no VPS. Roda no cron do root, UMA vez por minuto, e avisa por Telegram (via OpenClaw)
# quando algo quebra e quando se recupera. Instalado em /usr/local/bin/wecare-site-monitor.sh.
#
# Config em /etc/wecare-monitor.env (root, modo 600):
#   ALERT_TELEGRAM_CHAT=<id da conversa que recebe os alertas>   # sem isso, só registra no log
#
# Regra: avisa depois de 3 falhas seguidas do mesmo item (~3 min, evita alarme falso), lembra a cada 1 h
# enquanto continuar quebrado e avisa quando voltar. Limitação: se o VPS inteiro cair, ninguém roda este
# script — para isso é preciso um aviso externo (ex.: healthchecks.io / UptimeRobot).
set -u

CONF=/etc/wecare-monitor.env
[ -f "$CONF" ] && . "$CONF"
SITE="${SITE:-https://www.wecarehosting.com.br}"
FAILS_TO_ALERT="${FAILS_TO_ALERT:-3}"
REMIND_EVERY="${REMIND_EVERY:-3600}"
STATE="${STATE:-/var/lib/wecare-monitor}"
LOG="${LOG:-/var/log/wecare-monitor.log}"
OPENCLAW_BIN=/home/jarvis/.nvm/versions/node/v24.16.0/bin
mkdir -p "$STATE"

now=$(date +%s)
minute=$((10#$(date +%M)))
hour=$((10#$(date +%H)))

log() { printf '%s %s\n' "$(date '+%F %T')" "$1" >> "$LOG"; }

notify() {  # $1 = mensagem
  log "AVISO: $1"
  [ -z "${ALERT_TELEGRAM_CHAT:-}" ] && return 0
  local extra=""; [ "${DRY_RUN:-0}" = "1" ] && extra="--dry-run"
  sudo -u jarvis -H bash -lc "export PATH=$OPENCLAW_BIN:\$PATH; openclaw message send --channel telegram --target \"\$0\" -m \"\$1\" $extra" \
    "$ALERT_TELEGRAM_CHAT" "$1" >/dev/null 2>&1 || log "(falha ao enviar o aviso pelo OpenClaw)"
}

# check <nome> <descrição> <comando...>  — o comando deve sair com 0 se estiver tudo bem; sua saída vira o detalhe do alerta.
check() {
  local name="$1" desc="$2"; shift 2
  local detail ok=1
  detail="$("$@" 2>&1)" || ok=0
  local ff="$STATE/$name.fails" fa="$STATE/$name.alerted"
  local fails; fails=$(cat "$ff" 2>/dev/null || echo 0)
  if [ "$ok" = 1 ]; then
    if [ -f "$fa" ]; then notify "✅ WeCare site: $desc voltou ao normal."; rm -f "$fa"; fi
    echo 0 > "$ff"
    return 0
  fi
  fails=$((fails + 1)); echo "$fails" > "$ff"
  log "falha $fails em '$name': ${detail:0:200}"
  local last; last=$(cat "$fa" 2>/dev/null || echo 0)
  if [ "$fails" -ge "$FAILS_TO_ALERT" ] && { [ ! -f "$fa" ] || [ $((now - last)) -ge "$REMIND_EVERY" ]; }; then
    notify "🚨 WeCare site: $desc com problema (${fails} falhas seguidas). ${detail:0:240}"
    echo "$now" > "$fa"
  fi
  return 0
}

http_is() {  # url código-esperado [timeout]
  local code; code=$(curl -s -o /dev/null -m "${3:-15}" -w '%{http_code}' "$1") || true
  [ "$code" = "$2" ] || { echo "HTTP $code em $1"; return 1; }
}

cotacao_ok() {
  local ci co code
  ci=$(date -d '+60 days' +%F); co=$(date -d '+63 days' +%F)
  code=$(curl -s -o /dev/null -m 40 -w '%{http_code}' -X POST -H 'content-type: application/json' \
    -d "{\"listingId\":415609,\"checkin\":\"$ci\",\"checkout\":\"$co\",\"guests\":2}" "$SITE/api/reservas/cotacao") || true
  # 200 = cotou; 422 = datas indisponíveis (o Hostaway respondeu). Qualquer outra coisa = problema.
  case "$code" in 200|422) return 0;; *) echo "cotação devolveu HTTP $code (Hostaway/checkout fora?)"; return 1;; esac
}

agendador_ok() {
  local line ts age
  line=$(grep 'manutencao: HTTP 200' /var/log/wecare-reservas-cron.log 2>/dev/null | tail -n 1 | cut -c1-19)
  [ -n "$line" ] || { echo "nenhuma manutenção bem-sucedida no log"; return 1; }
  ts=$(date -d "$line" +%s 2>/dev/null) || { echo "log ilegível"; return 1; }
  age=$((now - ts))
  [ "$age" -le 1800 ] || { echo "última manutenção bem-sucedida há $((age/60)) min (reservas abandonadas não estão sendo liberadas)"; return 1; }
}

servicos_ok() {
  local s bad=""
  for s in wecare-site nginx; do systemctl is-active --quiet "$s" || bad="$bad $s"; done
  [ -z "$bad" ] || { echo "serviço parado:$bad"; return 1; }
}

disco_ok() {
  local use; use=$(df --output=pcent / | tail -n 1 | tr -dc '0-9')
  [ "$use" -lt 90 ] || { echo "disco em ${use}%"; return 1; }
}

memoria_ok() {
  local avail; avail=$(awk '/MemAvailable/ {print int($2/1024)}' /proc/meminfo)
  [ "$avail" -ge 250 ] || { echo "só ${avail} MB de memória disponível"; return 1; }
}

deploy_ok() {  # o último deploy terminou com erro (e não houve sucesso depois)?
  local log=/home/jarvis/apps/wecare-site/deploy/auto-deploy.log err ok
  [ -f "$log" ] || return 0
  err=$(grep -n ' ERRO' "$log" | tail -n 1 | cut -d: -f1); ok=$(grep -n 'Deploy concluído' "$log" | tail -n 1 | cut -d: -f1)
  [ -z "$err" ] && return 0
  [ -n "$ok" ] && [ "$ok" -gt "$err" ] && return 0
  echo "$(sed -n "${err}p" "$log" | cut -c1-200)"; return 1
}

cert_ok() {
  local end days
  end=$(echo | openssl s_client -connect 127.0.0.1:443 -servername www.wecarehosting.com.br 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
  [ -n "$end" ] || { echo "não consegui ler o certificado"; return 1; }
  days=$(( ($(date -d "$end" +%s) - now) / 86400 ))
  [ "$days" -ge 14 ] || { echo "certificado HTTPS vence em $days dias (renovação automática falhou?)"; return 1; }
}

# --- a cada minuto
check site       "o site (www.wecarehosting.com.br)"      http_is "$SITE/robots.txt" 200 10
# Se o site inteiro está fora, um aviso basta: as páginas só são verificadas quando o site responde.
if [ "$(cat "$STATE/site.fails" 2>/dev/null || echo 0)" -eq 0 ]; then
  check reservas "a página /reservas"                      http_is "$SITE/reservas" 200 15
  check imovel   "a página de um imóvel"                   http_is "$SITE/reservas/415609" 200 15
fi
# --- a cada 5 minutos
if [ $((minute % 5)) -eq 0 ] || [ "${FORCE_ALL:-0}" = 1 ]; then
  check cotacao    "a cotação de preços (Hostaway)"        cotacao_ok
  check agendador  "o agendador de rotinas"                agendador_ok
fi
# --- a cada 15 minutos
if [ $((minute % 15)) -eq 0 ] || [ "${FORCE_ALL:-0}" = 1 ]; then
  check servicos   "os serviços do site (site/nginx)"      servicos_ok
  check disco      "o espaço em disco do servidor"         disco_ok
  check memoria    "a memória do servidor"                 memoria_ok
  check deploy     "a última publicação (auto-deploy)"     deploy_ok
fi
# --- uma vez por dia (08:00)
if { [ "$hour" -eq 8 ] && [ "$minute" -eq 0 ]; } || [ "${FORCE_ALL:-0}" = 1 ]; then
  check certificado "o certificado HTTPS"                  cert_ok
fi
exit 0
