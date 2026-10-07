#!/usr/bin/env bash
# Auto-deploy do site WeCare (www.wecarehosting.com.br) — git pull (branch main) + build + troca de release.
# Roda via cron do usuário `jarvis` a cada 5 minutos; mesmo padrão do claire-project, wecare-onboarding
# e photo-enhancer-web (detecção de commit novo + lock + log), com duas diferenças:
#   • cada publicação vira uma pasta em /srv/wecare-site/releases/<data>-<commit>, e `current` aponta para ela;
#   • depois do restart o script confere se o site responde — se não responder, volta sozinho para a release anterior.
#
# Só faz algo se houver commit novo em origin/$BRANCH. Para testar outra branch: BRANCH=minha-branch deploy/auto-deploy.sh
set -euo pipefail

# Parâmetros: os padrões são os de PRODUÇÃO. O ambiente de desenvolvimento (deploy/auto-deploy-dev.sh)
# só troca estes valores — o resto do script é o mesmo.
REPO_DIR="${REPO_DIR:-/home/jarvis/apps/wecare-site}"
BRANCH="${BRANCH:-main}"
BASE="${BASE:-/srv/wecare-site}"
SERVICE="${SERVICE:-wecare-site}"
PORT="${PORT:-3010}"
HEALTH_HOST="${HEALTH_HOST:-www.wecarehosting.com.br}"
WARM="${WARM:-1}"                     # 1 = aquece o índice de disponibilidade depois de publicar (só produção)
NODE_BIN="/home/jarvis/.nvm/versions/node/v24.16.0/bin"
LOG_FILE="$REPO_DIR/deploy/auto-deploy.log"
# UM lock para os dois ambientes: o servidor é pequeno e compartilhado, então nunca há dois builds ao mesmo
# tempo; se o outro ambiente está publicando, este ciclo é pulado e o próximo cron (5 min) tenta de novo.
LOCK_FILE="/tmp/wecare-site-autodeploy.lock"
KEEP_RELEASES=4

log() { printf '%s %s\n' "$(date -Is)" "$1" >> "$LOG_FILE"; }
main() {

  # Evita duas execuções sobrepostas (um build pode levar mais de 5 min).
  exec 9>"$LOCK_FILE"
  if ! flock -n 9; then
    log "Já existe um deploy em andamento — saindo."
    exit 0
  fi

  cd "$REPO_DIR"
  git fetch origin "$BRANCH" --quiet

  LOCAL_REV="$(git rev-parse HEAD)"
  REMOTE_REV="$(git rev-parse "origin/$BRANCH")"
  CURRENT_OK=true
  [ -L "$BASE/current" ] || CURRENT_OK=false

  if [ "$LOCAL_REV" = "$REMOTE_REV" ] && [ "$CURRENT_OK" = true ] && [ "${FORCE:-0}" != "1" ]; then
    exit 0  # nada novo — sem log, senão o arquivo cresce sem parar a cada 5 min
  fi

  CHANGED_FILES="$(git diff --name-only "$LOCAL_REV" "$REMOTE_REV" 2>/dev/null || true)"
  log "Novo commit detectado (${LOCAL_REV:0:8} -> ${REMOTE_REV:0:8}). Arquivos alterados:"
  log "$(sed 's/^/    /' <<<"${CHANGED_FILES:-(primeira publicação)}")"

  if [ "$LOCAL_REV" != "$REMOTE_REV" ]; then
    if ! git checkout -q "$BRANCH" 2>>"$LOG_FILE" || ! git pull --ff-only origin "$BRANCH" >> "$LOG_FILE" 2>&1; then
      log "ERRO: git pull --ff-only falhou (histórico divergente?). Abortando deploy."
      exit 1
    fi
  fi

  export PATH="$NODE_BIN:$PATH"

  if [ ! -d node_modules ] || grep -qE '^package(-lock)?\.json$' <<<"$CHANGED_FILES"; then
    log "Instalando dependências (npm ci)..."
    if ! npm ci --silent --no-audit --no-fund >> "$LOG_FILE" 2>&1; then
      log "ERRO: npm ci falhou. A versão anterior continua no ar."
      exit 1
    fi
  fi

  # O servidor é compartilhado com outros sistemas: o build roda com prioridade baixa e memória limitada.
  # WECARE_PRODUCTION=1: se faltar credencial do Hostaway durante o build, falha em vez de usar dados de exemplo.
  log "Build..."
  if ! SITE_ENV_LABEL="${SITE_ENV_LABEL:-}" WECARE_PRODUCTION=1 NODE_OPTIONS="--max-old-space-size=1536" NEXT_TELEMETRY_DISABLED=1 nice -n 10 npm run build >> "$LOG_FILE" 2>&1; then
    log "ERRO: npm run build falhou. A versão anterior continua no ar."
    exit 1
  fi

  REV_SHORT="$(git rev-parse --short HEAD)"
  REL="$(date +%Y%m%d-%H%M%S)-$REV_SHORT"
  REL_DIR="$BASE/releases/$REL"
  mkdir -p "$REL_DIR/.next"
  # output: 'standalone' não copia public/ nem .next/static/ sozinho — o server.js precisa dos dois ao lado dele.
  cp -a .next/standalone/. "$REL_DIR/"
  rm -rf "$REL_DIR/.next/cache"
  cp -r .next/static "$REL_DIR/.next/static"
  cp -r public "$REL_DIR/public"
  ln -s "$BASE/cache" "$REL_DIR/.next/cache"   # cache compartilhado (imagens otimizadas), mantido entre releases
  chmod -R a+rX "$REL_DIR"

  PREVIOUS="$(readlink "$BASE/current" 2>/dev/null || true)"
  ln -sfn "$REL_DIR" "$BASE/current"

  if ! sudo /usr/bin/systemctl restart "$SERVICE"; then
    log "ERRO: falha ao reiniciar $SERVICE via systemctl. Verifique o sudoers (deploy/sudoers/wecare-site-deploy)."
    exit 1
  fi

  healthy() {
    for _ in $(seq 1 20); do
      code="$(curl -s -o /dev/null -w '%{http_code}' -H "Host: $HEALTH_HOST" "http://127.0.0.1:$PORT/robots.txt" || true)"
      [ "$code" = "200" ] && return 0
      sleep 2
    done
    return 1
  }

  if ! healthy; then
    log "ERRO: o site não respondeu depois do restart. Voltando para ${PREVIOUS:-<nenhuma release anterior>}."
    if [ -n "$PREVIOUS" ]; then
      ln -sfn "$PREVIOUS" "$BASE/current"
      sudo /usr/bin/systemctl restart "$SERVICE" || true
      healthy && log "Rollback ok: site de volta na release anterior." || log "ATENÇÃO: site não respondeu nem após o rollback!"
    fi
    exit 1
  fi

  # Mantém só as últimas releases (a ativa e a anterior estão sempre entre elas).
  ls -1 "$BASE/releases" | sort | head -n -"$KEEP_RELEASES" | while read -r old; do rm -rf "$BASE/releases/$old"; done

  # Aquece o índice de disponibilidade (leva ~40 s) para a primeira busca com datas não pegar um visitante.
  if [ "$WARM" = "1" ]; then
    sudo /usr/local/bin/wecare-reservas-cron.sh manutencao >> "$LOG_FILE" 2>&1 || log "(aquecimento falhou; o cron de manutenção tenta de novo em até 10 min)"
  fi

  log "Deploy concluído. Release $REL no ar (HEAD ${REV_SHORT})."

}

# O arquivo inteiro já foi lido neste ponto: se o git pull trocar este script no meio da execução, nada quebra.
main "$@"
exit $?
