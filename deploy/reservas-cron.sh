#!/bin/bash
# Chama as rotinas de manutenção do site de reservas (www.wecarehosting.com.br).
# Uso: wecare-reservas-cron.sh manutencao|traducoes|pontos
# Quem trabalha é o site (Vercel); este servidor só "toca o despertador". O segredo fica em
# /root/.wecare-reservas.curlrc (modo 600). Um trava por rotina evita execuções sobrepostas.
set -u
JOB="${1:?uso: $0 manutencao|traducoes|pontos}"
case "$JOB" in manutencao|traducoes|pontos) ;; *) echo "rotina desconhecida: $JOB" >&2; exit 2;; esac

LOG=/var/log/wecare-reservas-cron.log
exec 9>"/var/lock/wecare-reservas-$JOB.lock"
flock -n 9 || { echo "$(date '+%F %T') $JOB: ainda rodando, pulei" >> "$LOG"; exit 0; }

START=$(date +%s)
BODY=$(curl -sS -K /root/.wecare-reservas.curlrc -m 320 -w '\n%{http_code}' -H "Host: www.wecarehosting.com.br" "http://127.0.0.1:3010/api/reservas/$JOB" 2>&1)
CODE=$(printf '%s' "$BODY" | tail -n1)
SUMMARY=$(printf '%s' "$BODY" | head -n -1 | head -c 220 | tr '\n' ' ')
echo "$(date '+%F %T') $JOB: HTTP $CODE em $(( $(date +%s) - START ))s | $SUMMARY" >> "$LOG"

# mantém o log pequeno (últimas 800 linhas)
tail -n 800 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
[ "$CODE" = "200" ]
