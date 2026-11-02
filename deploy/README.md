# Site no VPS — www.wecarehosting.com.br

Desde 06/10/2026 o site roda no VPS da WeCare (Oracle, Vinhedo/SP; host `wecare-vps`).
Saímos da Vercel porque o plano Hobby pausou a conta por excesso de requisições
(`FAIR_USE_LIMITS_EXCEEDED`) e o site ficou fora do ar (402 `DEPLOYMENT_DISABLED`).

## Como o deploy funciona (mesmo padrão das outras apps)
1. Merge no `main` do GitHub.
2. Em até 5 minutos o cron do usuário `jarvis` roda `deploy/auto-deploy.sh`: busca o `main`, e se há commit novo faz
   `git pull --ff-only`, `npm ci` (só se o `package*.json` mudou), `npm run build`, monta uma release nova em
   `/srv/wecare-site/releases/<data>-<commit>`, aponta `current` para ela e reinicia o serviço `wecare-site`.
3. Confere se o site responde. **Se não responder, volta sozinho para a release anterior.**
4. Aquece o cache de disponibilidade e registra tudo em `deploy/auto-deploy.log`.

Falhas de build ou de `npm ci` deixam a versão atual no ar (o log diz o motivo).

## Ambientes e fluxo de trabalho
| | Produção | Desenvolvimento |
|---|---|---|
| Endereço | https://www.wecarehosting.com.br | https://dev-site.wecarehosting.com.br |
| Branch | `main` | `develop` |
| Publicação | em até 5 min depois do merge no `main` | em até 5 min depois do merge no `develop` |
| Clone no servidor | `/home/jarvis/apps/wecare-site` | `/home/jarvis/apps/wecare-site-dev` |
| Serviço / porta | `wecare-site` / 3010 | `wecare-site-dev` / 3011 (teto de 800 MB de RAM) |
| Releases | `/srv/wecare-site` | `/srv/wecare-site-dev` |
| Variáveis | `/etc/wecare-site.env` | `/etc/wecare-site-dev.env` |
| Pagamento (InfinitePay) | ligado | **desligado** (sem `INFINITEPAY_HANDLE`): não cria reservas nem links de pagamento |
| Rotinas agendadas (manutenção, traduções…) | sim | não |
| Indexação no Google | sim | **não** (`X-Robots-Tag: noindex`) e faixa laranja "AMBIENTE DE TESTES" no topo |

**Como mudar o site com segurança:** `feature` → PR para **`develop`** → (publica sozinho no ambiente de testes) →
quem pediu a mudança confere em dev-site → PR de **`develop` para `main`** → (publica sozinho em produção).
`develop` e `main` usam o mesmo `deploy/auto-deploy.sh`; o do desenvolvimento só troca parâmetros (`deploy/auto-deploy-dev.sh`).
Há **um lock só** para os dois ambientes: o servidor é pequeno e nunca faz dois builds ao mesmo tempo (um ciclo é
pulado e o seguinte, 5 min depois, publica).

## Peças
| Peça | Onde |
|---|---|
| Código no servidor | `/home/jarvis/apps/wecare-site` (clone do repositório, branch `main`) |
| Serviço | `wecare-site.service` (`deploy/systemd/`), usuário `wecaresite`, porta 3010, limite 1,2 GB de RAM |
| Releases | `/srv/wecare-site/releases/` (guarda as 4 últimas); `current` = a ativa |
| Cache do Next (imagens otimizadas) | `/srv/wecare-site/cache`, compartilhado entre releases |
| Segredos | `/etc/wecare-site.env` (root, modo 600) — fora do repositório |
| nginx + HTTPS | `deploy/nginx/www.wecarehosting.com.br`; certificado Let's Encrypt (certbot, renovação automática); limite 50 req/min por IP em `/api/reservas/` e `/api/infinitepay/`, exceto cotação e calendário (zona `wecare_quote`: 120 req/min, burst 30; declarar `limit_req_zone ... zone=wecare_quote:10m rate=120r/m;` em `conf.d/wecare-site-ratelimit.conf`) |
| sudoers do deploy | `deploy/sudoers/wecare-site-deploy` (só reiniciar o site e aquecer o cache) |
| Agendador de rotinas | cron do root (`deploy/cron-root`) + `deploy/reservas-cron.sh`; log em `/var/log/wecare-reservas-cron.log` |
| Monitor e alertas | `deploy/monitor.sh` → `/usr/local/bin/wecare-site-monitor.sh`, cron do root a cada minuto; config em `/etc/wecare-monitor.env`; log `/var/log/wecare-monitor.log` (ver abaixo) |
| Dados da IA (traduções, pontos de interesse) | Vercel Blob (`reservas/…`), token em `BLOB_READ_WRITE_TOKEN` |

## Monitor e alertas
Verifica, a cada minuto, o site, `/reservas` e uma página de imóvel; a cada 5 min a cotação (Hostaway) e se o agendador
está rodando (a manutenção libera as reservas não pagas); a cada 15 min os serviços, disco, memória e se o último
deploy falhou; todo dia às 08:00 a validade do certificado. Avisa por **Telegram** (via OpenClaw) depois de 3 falhas
seguidas do mesmo item, lembra a cada 1 h enquanto estiver quebrado e avisa quando voltar.
Para receber os avisos: `ALERT_TELEGRAM_CHAT=<id da conversa>` em `/etc/wecare-monitor.env` (sem isso só registra no log).
**Limitação:** se o VPS inteiro cair, ninguém roda o monitor — para isso é preciso um aviso externo (healthchecks.io, UptimeRobot).
Testar sem enviar nada: `DRY_RUN=1 FORCE_ALL=1 /usr/local/bin/wecare-site-monitor.sh`.

## Avaliador (`/avalie`)

Estimativa de receita para o proprietário. A página é `noindex` e fica de fora do sitemap.

Os leads e o contador de uso **não** podem ficar dentro da release (`WorkingDirectory` = `/srv/wecare-site/current` ou `/srv/wecare-site-dev/current`): essa pasta é trocada a cada deploy. Defina um diretório fora dela.

| Ambiente | `AVALIADOR_DATA_DIR` |
|---|---|
| Produção | `/srv/wecare-site/data/avaliador` |
| Desenvolvimento | `/srv/wecare-site-dev/data/avaliador` |

Sem a variável o processo grava em `.data/avaliador` dentro da release (some no próximo deploy) e avisa no journal. O unit em `deploy/systemd/` libera escrita em `/srv/.../data` (`ReadWritePaths`). O unit já instalado em `/etc/systemd/system` só muda se for copiado de novo e recarregado.

```bash
sudo mkdir -p /srv/wecare-site/data/avaliador /srv/wecare-site-dev/data/avaliador
sudo chown wecaresite:wecaresite /srv/wecare-site/data/avaliador /srv/wecare-site-dev/data/avaliador
sudo chmod 700 /srv/wecare-site/data/avaliador /srv/wecare-site-dev/data/avaliador
sudo cp deploy/systemd/wecare-site.service deploy/systemd/wecare-site-dev.service /etc/systemd/system/
sudo systemctl daemon-reload
```

Em `/etc/wecare-site.env` e `/etc/wecare-site-dev.env`:

```bash
AVALIADOR_DATA_DIR=/srv/wecare-site/data/avaliador   # no dev: /srv/wecare-site-dev/data/avaliador
AVALIADOR_IP_SALT=<segredo longo; o padrão do código é público>
```

Arquivos no diretório: `uso.json` (contador por hash de IP) e `leads.jsonl` (um JSON por linha).

### Aviso de lead — desligado por padrão

Nada é enviado até uma das variáveis abaixo existir. Cada lead gravado deixa no journal a linha `notificação de lead desligada` quando as duas estão vazias. Falha de webhook ou de e-mail também vai para o journal; a estimativa continua sendo respondida.

```bash
# Webhook: POST JSON do lead. Vazio = desligado.
AVALIADOR_LEAD_WEBHOOK=https://exemplo.interno/leads

# E-mail. Sem AVALIADOR_SMTP_HOST o journal registra que o e-mail não saiu.
AVALIADOR_LEAD_EMAIL=comercial@wecarehosting.com.br
AVALIADOR_LEAD_EMAIL_FROM=avaliador@wecarehosting.com.br
AVALIADOR_SMTP_HOST=smtp.exemplo.com
AVALIADOR_SMTP_PORT=587
AVALIADOR_SMTP_USER=
AVALIADOR_SMTP_PASS=
# AVALIADOR_SMTP_SECURE=starttls   # padrão na porta 587; tls na 465; plain só em relay local de confiança
```

Os dois caminhos podem ficar ligados juntos. A segunda simulação pede contato só no navegador (não por IP). O e-mail da estimativa para o endereço digitado na tela usa o mesmo SMTP; sem `AVALIADOR_SMTP_HOST` a tela confirma o contato e não envia. Detalhe em `README.md`.

## Operação
```bash
ssh wecare-vps
tail -f /home/jarvis/apps/wecare-site/deploy/auto-deploy.log     # deploys
journalctl -u wecare-site -f                                      # site
tail -f /var/log/wecare-reservas-cron.log                         # rotinas agendadas
sudo -u jarvis /home/jarvis/apps/wecare-site/deploy/rollback.sh   # volta uma release
sudo -u jarvis FORCE=1 /home/jarvis/apps/wecare-site/deploy/auto-deploy.sh   # republica o HEAD atual
```
**Rollback:** o auto-deploy segue o `main`. Se o commit ruim continua lá, reverta-o (`git revert`) — senão o próximo
ciclo publica a versão ruim de novo.

**Variáveis:** edite `/etc/wecare-site.env` e `systemctl restart wecare-site`. Para gerar traduções/mapas novos é
preciso `ANTHROPIC_API_KEY` nesse arquivo.

## Instalação do zero (referência)
Usuário `wecaresite`; `/srv/wecare-site/{releases,cache}`; `deploy/systemd/*.service` em `/etc/systemd/system/`;
`deploy/sudoers/*` em `/etc/sudoers.d/` (0440); clone em `/home/jarvis/apps/wecare-site`; `deploy/cron` no crontab do jarvis;
`deploy/nginx/*` em `sites-available` + link em `sites-enabled` + `certbot --nginx`.

