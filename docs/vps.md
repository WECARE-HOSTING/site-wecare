# Site no VPS (www.wecarehosting.com.br)

Desde 06/10/2026 o site roda no VPS da WeCare (Oracle, Vinhedo/SP; host `wecare-vps` no `~/.ssh/config`).
Saímos da Vercel porque o plano Hobby pausou a conta por excesso de requisições (`FAIR_USE_LIMITS_EXCEEDED`).

## Como está montado
| Peça | Onde |
|---|---|
| App | Next.js `standalone`, serviço systemd `wecare-site` (usuário `wecaresite`, porta 3010, limite de 1,2 GB de RAM) |
| Releases | `/srv/wecare-site/releases/<data>/`, `current` aponta para a ativa (guarda as 4 últimas) |
| Cache do Next (imagens otimizadas etc.) | `/srv/wecare-site/cache`, compartilhado entre releases |
| Variáveis (segredos) | `/etc/wecare-site.env` (root, modo 600) |
| nginx | `/etc/nginx/sites-available/www.wecarehosting.com.br` (www, raiz→www, `reserva.`) + limite 20 req/min por IP em `/api/reservas/` e `/api/infinitepay/` |
| TLS | certbot (renovação automática) |
| Agendador | `crontab` do root: manutenção a cada 10 min; traduções e pontos de interesse a cada hora. Script `/usr/local/bin/wecare-reservas-cron.sh`, log `/var/log/wecare-reservas-cron.log` |
| Dados da IA | Vercel Blob (`reservas/…`), via `BLOB_READ_WRITE_TOKEN` |

## Publicar / voltar
```bash
scripts/deploy-vps.sh            # build local, envia, ativa, aquece, confere
scripts/deploy-vps.sh rollback   # volta para a release anterior
```

## Operação
```bash
ssh wecare-vps systemctl status wecare-site
ssh wecare-vps journalctl -u wecare-site -f
ssh wecare-vps tail -f /var/log/wecare-reservas-cron.log
```
Para mudar uma variável: editar `/etc/wecare-site.env` e `systemctl restart wecare-site`.
Para gerar traduções/mapas novos é preciso `ANTHROPIC_API_KEY` nesse arquivo.
