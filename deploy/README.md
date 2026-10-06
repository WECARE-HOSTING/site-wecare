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

## Peças
| Peça | Onde |
|---|---|
| Código no servidor | `/home/jarvis/apps/wecare-site` (clone do repositório, branch `main`) |
| Serviço | `wecare-site.service` (`deploy/systemd/`), usuário `wecaresite`, porta 3010, limite 1,2 GB de RAM |
| Releases | `/srv/wecare-site/releases/` (guarda as 4 últimas); `current` = a ativa |
| Cache do Next (imagens otimizadas) | `/srv/wecare-site/cache`, compartilhado entre releases |
| Segredos | `/etc/wecare-site.env` (root, modo 600) — fora do repositório |
| nginx + HTTPS | `deploy/nginx/www.wecarehosting.com.br`; certificado Let's Encrypt (certbot, renovação automática); limite 20 req/min por IP em `/api/reservas/` e `/api/infinitepay/` |
| sudoers do deploy | `deploy/sudoers/wecare-site-deploy` (só reiniciar o site e aquecer o cache) |
| Agendador de rotinas | cron do root (`deploy/cron-root`) + `deploy/reservas-cron.sh`; log em `/var/log/wecare-reservas-cron.log` |
| Dados da IA (traduções, pontos de interesse) | Vercel Blob (`reservas/…`), token em `BLOB_READ_WRITE_TOKEN` |

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
