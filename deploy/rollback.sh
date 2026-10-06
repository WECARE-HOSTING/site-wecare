#!/usr/bin/env bash
# Volta o site para a release anterior (as últimas 4 ficam guardadas em /srv/wecare-site/releases).
# Rode no servidor como jarvis:  deploy/rollback.sh
# Atenção: o auto-deploy continua olhando o `main`. Se o commit ruim ainda está no main, reverta-o lá
# (git revert), senão o próximo ciclo publica a versão ruim de novo.
set -euo pipefail
BASE="/srv/wecare-site"
cur="$(basename "$(readlink "$BASE/current")")"
prev="$(ls -1 "$BASE/releases" | sort | grep -B1 -x "$cur" | head -n 1)"
[ -n "$prev" ] && [ "$prev" != "$cur" ] || { echo "Não há release anterior."; exit 1; }
ln -sfn "$BASE/releases/$prev" "$BASE/current"
sudo /usr/bin/systemctl restart wecare-site
echo "Rollback: $cur -> $prev"
