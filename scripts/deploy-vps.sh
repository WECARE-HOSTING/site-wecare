#!/bin/bash
# Publishes the site to the WeCare VPS (host alias `wecare-vps` in ~/.ssh/config).
#
#   scripts/deploy-vps.sh            build here, ship, switch, restart, health-check
#   scripts/deploy-vps.sh rollback   point `current` at the previous release and restart
#
# Layout on the server (see docs/vps.md):
#   /srv/wecare-site/releases/<timestamp>/   one folder per publish (standalone build)
#   /srv/wecare-site/current -> releases/..  what systemd runs (wecare-site.service)
#   /srv/wecare-site/cache                   shared Next cache (optimized images), kept across releases
set -euo pipefail
HOST="${VPS_HOST:-wecare-vps}"
BASE=/srv/wecare-site

if [ "${1:-}" = "rollback" ]; then
  ssh "$HOST" "set -e; cd $BASE/releases; prev=\$(ls -1 | sort | tail -n 2 | head -n 1); ln -sfn $BASE/releases/\$prev $BASE/current; systemctl restart wecare-site; echo \"rollback para \$prev\""
  exit 0
fi

cd "$(dirname "$0")/.."
echo "→ build"
npx next build

REL="$(date +%Y%m%d-%H%M%S)"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
cp -r .next/standalone/. "$STAGE/"
mkdir -p "$STAGE/.next"
cp -r .next/static "$STAGE/.next/static"
cp -r public "$STAGE/public"
rm -rf "$STAGE/.next/cache"            # replaced below by the shared cache
ln -s "$BASE/cache" "$STAGE/.next/cache"

echo "→ enviando release $REL"
ssh "$HOST" "mkdir -p $BASE/releases/$REL"
rsync -az --delete "$STAGE/" "$HOST:$BASE/releases/$REL/"

echo "→ ativando"
ssh "$HOST" "set -e; chown -R wecaresite:wecaresite $BASE/releases/$REL; ln -sfn $BASE/releases/$REL $BASE/current; systemctl restart wecare-site; cd $BASE/releases && ls -1 | sort | head -n -4 | xargs -r rm -rf"

echo "→ verificando"
for i in $(seq 1 20); do
  code=$(ssh "$HOST" "curl -s -o /dev/null -w '%{http_code}' -H 'Host: www.wecarehosting.com.br' http://127.0.0.1:3010/robots.txt" || true)
  if [ "$code" = "200" ]; then
    echo "→ aquecendo caches (índice de disponibilidade); leva ~40 s"
    ssh "$HOST" "/usr/local/bin/wecare-reservas-cron.sh manutencao" || echo "(aquecimento falhou; o agendador tenta de novo em até 10 min)"
    echo "ok: release $REL no ar (HTTP 200)"
    exit 0
  fi
  sleep 2
done
echo "FALHOU: o site não respondeu; use scripts/deploy-vps.sh rollback" >&2
exit 1
