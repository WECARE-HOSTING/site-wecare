import Link from "next/link";
import type { BlogPost } from "../types";

const meta: BlogPost["meta"] = {
  slug: "gestao-airbnb-sem-fidelidade",
  eyebrow: "Contrato e condições",
  title: "Gestão de Airbnb sem fidelidade: como funciona na WeCare",
  description:
    "Sem multa, sem contrato amarrado. Veja o que continua obrigatório (seguro, taxa única) e por que o churn da WeCare é menor que 1% ao mês mesmo sem fidelidade contratual.",
  datePublished: "2026-07-03",
  dateModified: "2026-07-03",
  keywords: [
    "gestão de Airbnb sem fidelidade",
    "administração de Airbnb sem multa",
    "contrato de gestão de Airbnb sem fidelidade",
    "sair da gestora de Airbnb quando quiser",
  ],
  faq: [
    {
      q: "Tenho fidelidade ou multa na WeCare?",
      a: "Não. Sem fidelidade e sem multa — você entra e sai quando quiser. A relação se sustenta por resultado, não por contrato amarrado.",
    },
    {
      q: "Se eu sair, perco o seguro ou pago alguma taxa retroativa?",
      a: "Não. O seguro EasyCover é cobrado mês a mês, enquanto o contrato está ativo — não há cobrança retroativa nem taxa de saída. A taxa de adesão, por ser única e paga no início, também não é devolvida nem cobrada de novo.",
    },
    {
      q: "Por que uma gestora abriria mão de prender o cliente por contrato?",
      a: "Porque a fidelidade contratual protege a gestora, não o proprietário. A WeCare prefere que a permanência dependa do resultado do Relatório WeCare todo mês. Isso obriga a operação a se manter no padrão — não apenas até a assinatura.",
    },
    {
      q: "Isso vale para os dois planos, Gestão Online e Gestão 360?",
      a: "Sim. Tanto a Gestão Online (15% das locações) quanto a Gestão 360 (20%, com operação física completa) seguem o mesmo princípio: sem mensalidade fixa, sem fidelidade. A WeCare só ganha quando o imóvel rende.",
    },
  ],
  related: ["como-escolher-empresa-gestao-airbnb", "property-management-airbnb", "locacao-por-temporada"],
};

function Content() {
  return (
    <>
      <h2>Resposta direta</h2>
      <p>
        Sim. No contrato-padrão da WeCare não existe cláusula de fidelidade nem multa de rescisão. Você contrata a
        gestão do seu imóvel e pode encerrar quando quiser, sem penalidade. A relação se sustenta pelo resultado
        entregue mês a mês — não por uma cláusula que impede a sua saída. Isso vale para os dois{" "}
        <Link href="/#planos">planos de gestão</Link>, Online e 360.
      </p>

      <h2>Por que a WeCare não usa contrato de fidelidade</h2>
      <p>
        A lógica é simples: se o proprietário só continua porque existe multa, o problema é a gestão, não o
        contrato. A WeCare prefere ser avaliada pelo resultado do repasse todo mês, não por uma cláusula que amarra.
        Isso muda o incentivo — a gestora precisa performar continuamente para manter o cliente, não apenas no
        primeiro ano. Essa é a mesma filosofia por trás de &ldquo;quem entra, fica&rdquo;: a permanência é escolha,
        não obrigação contratual.
      </p>

      <h2>O que continua obrigatório mesmo sem fidelidade</h2>
      <p>
        Sem fidelidade não significa sem estrutura. Dois itens seguem valendo em qualquer contrato ativo,
        independentemente do prazo de permanência:
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>O que é</th>
              <th>Natureza</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Seguro EasyCover</td>
              <td>R$ 120/mês — cobre danos ao imóvel e aos objetos do proprietário</td>
              <td>Obrigatório em todo contrato, do primeiro ao último mês</td>
            </tr>
            <tr>
              <td>Taxa de adesão</td>
              <td>Cobrança única no início, cobre o onboarding e o setup do anúncio</td>
              <td>Paga uma vez, não é recorrente e não se confunde com multa</td>
            </tr>
            <tr>
              <td>Pagadoria (opcional)</td>
              <td>R$ 99/mês — WeCare paga condomínio, água, energia, IPTU e internet e desconta do repasse</td>
              <td>Opcional, o proprietário decide se contrata</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Como funciona a saída, na prática</h2>
      <p>
        Encerrar a gestão não exige justificativa nem negociação de multa. O proprietário comunica a intenção de
        sair e a transição é organizada para não deixar reservas confirmadas sem operação — o compromisso da WeCare
        é com o hóspede que já reservou, não em reter o proprietário à força. Não há cobrança adicional pelo
        encerramento, e o imóvel — sempre do proprietário — volta a ser gerido por quem ele escolher.
      </p>

      <h2>Sem fidelidade não é sinônimo de sem compromisso — é o oposto</h2>
      <p>
        Contrato de fidelidade é uma ferramenta para reter um cliente insatisfeito. A WeCare escolheu não depender
        dela. A prova de que isso funciona não é uma promessa — é um número: o churn da WeCare fica abaixo de 1%, e
        os clientes ficam, em média, 5 anos. Se a ausência de multa fosse um risco para o negócio, esses números
        seriam outros.
      </p>

      <h2>Gestão com fidelidade x gestão sem fidelidade (WeCare)</h2>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Modelo com fidelidade/multa</th>
              <th>Modelo WeCare (sem fidelidade)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Prazo mínimo de contrato</td>
              <td>Normalmente 12 meses</td>
              <td>Nenhum</td>
            </tr>
            <tr>
              <td>Custo para sair antes do prazo</td>
              <td>Multa rescisória</td>
              <td>Nenhum custo adicional</td>
            </tr>
            <tr>
              <td>O que sustenta a permanência do cliente</td>
              <td>Cláusula contratual</td>
              <td>Resultado mensal</td>
            </tr>
            <tr>
              <td>Uso pessoal do imóvel</td>
              <td>Varia por contrato, às vezes com taxa</td>
              <td>Sempre livre, sem taxa, bloqueando as datas que quiser</td>
            </tr>
            <tr>
              <td>Seguro contra danos</td>
              <td>Varia por gestora</td>
              <td>Obrigatório (EasyCover, R$ 120/mês) em todo contrato</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        A ausência de fidelidade é só um dos critérios que separam uma gestora boa de uma gestora que só quer
        crescer volume — veja os outros 6 em{" "}
        <Link href="/blog/como-escolher-empresa-gestao-airbnb">
          Como escolher uma empresa de administração de Airbnb
        </Link>
        .
      </p>

      <div className="wc-faq-block">
        <h2>Perguntas frequentes</h2>
        {meta.faq.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>

      <p style={{ marginTop: 32 }}>
        Confira também os <Link href="/#servicos">serviços inclusos na gestão</Link> e o restante do{" "}
        <Link href="/#faq">FAQ do site</Link>.
      </p>
    </>
  );
}

export const post: BlogPost = { meta, Content };
