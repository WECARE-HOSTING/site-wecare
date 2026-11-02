This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Avaliador (`/avalie`)

Estimativa de receita para o proprietário. A página fica `noindex` e fora do sitemap até o lançamento.

### Leads persistentes

O deploy troca a pasta da release. Defina `AVALIADOR_DATA_DIR` **fora** dessa pasta, senão `uso.json` e `leads.jsonl` somem no deploy seguinte e o processo avisa no log.

| Ambiente | Valor |
|---|---|
| Produção | `/srv/wecare-site/data/avaliador` |
| Desenvolvimento | `/srv/wecare-site-dev/data/avaliador` |
| Máquina local | pode omitir; usa `.data/avaliador` (está no `.gitignore`) |

O serviço systemd só escreve nos caminhos de `ReadWritePaths`. A criação da pasta, o `chown` para `wecaresite` e a cópia do unit estão em `deploy/README.md`. `AVALIADOR_IP_SALT` troca o sal do hash de IP (o padrão do código é público).

### Aviso de lead (desligado por padrão)

Sem as variáveis abaixo, cada lead gravado registra `notificação de lead desligada` e fica só no arquivo. Nada é enviado.

- `AVALIADOR_LEAD_WEBHOOK` — URL que recebe `POST` com o JSON do lead.
- `AVALIADOR_LEAD_EMAIL` — destinatário interno. Exige `AVALIADOR_SMTP_HOST`. Opcionais: `AVALIADOR_LEAD_EMAIL_FROM` (padrão `avaliador@wecarehosting.com.br`), `AVALIADOR_SMTP_PORT` (padrão `587`), `AVALIADOR_SMTP_USER`, `AVALIADOR_SMTP_PASS`, `AVALIADOR_SMTP_SECURE` (`starttls` na 587, `tls` na 465, `plain` só em relay local).

A segunda simulação pede contato só neste navegador, depois que um resultado foi mostrado (`localStorage` `wc_av_v2_n`). O servidor não usa IP nem o cookie antigo `wc_av_uso` para isso. O arquivo de leads continua em `AVALIADOR_DATA_DIR` quando a pasta existe.

**Enviar por e-mail** na tela manda a estimativa para o endereço que a pessoa digitou, pelo mesmo SMTP. Sem `AVALIADOR_SMTP_HOST` o contato é registrado e a tela avisa que o envio automático está desligado. PDF e WhatsApp não dependem de SMTP.

Webhook e e-mail podem ficar ligados ao mesmo tempo. Falha de envio vai para o log e não esconde a estimativa.
