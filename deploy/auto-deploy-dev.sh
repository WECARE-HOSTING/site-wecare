#!/usr/bin/env bash
# Auto-deploy do ambiente de DESENVOLVIMENTO (https://dev-site.wecarehosting.com.br) — acompanha a branch `develop`.
# Mesmo script da produção (deploy/auto-deploy.sh), só com outros parâmetros: outro clone, outro serviço, outra
# porta, outra pasta de releases e sem aquecimento de cache. Roda no cron do `jarvis` a cada 5 minutos.
# Padrão das outras apps: claire-project-staging / wecare-onboarding-staging.
export REPO_DIR=/home/jarvis/apps/wecare-site-dev
export BRANCH=develop
export BASE=/srv/wecare-site-dev
export SERVICE=wecare-site-dev
export PORT=3011
export HEALTH_HOST=dev-site.wecarehosting.com.br
export WARM=0
export SITE_ENV_LABEL="AMBIENTE DE TESTES · develop"   # a faixa laranja que aparece no topo das páginas
exec "$REPO_DIR/deploy/auto-deploy.sh"
