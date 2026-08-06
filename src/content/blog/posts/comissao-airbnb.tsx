import Link from "next/link";
import type { BlogPost } from "../types";

const meta: BlogPost["meta"] = {
  slug: "comissao-airbnb",
  eyebrow: "Custos",
  title: "Quanto é a comissão do Airbnb? Taxa de serviço x comissão de gestão profissional",
  description:
    "O Airbnb cobra 16% do anfitrião no Brasil pelo acesso à plataforma. A comissão de uma gestora paga outra coisa: a operação do imóvel.",
  datePublished: "2026-08-05",
  dateModified: "2026-08-05",
  keywords: [
    "comissão Airbnb",
    "taxa de serviço Airbnb",
    "quanto o Airbnb cobra do anfitrião",
    "taxa Airbnb Brasil",
    "comissão gestora Airbnb",
    "custo de gestão Airbnb",
  ],
  faq: [
    {
      q: "Quanto o Airbnb cobra de comissão do anfitrião?",
      a: "Depende do modelo do seu anúncio. No de taxa única, 16% no Brasil e 15,5% na maior parte do mundo, sobre o subtotal da reserva. No dividido, 4% para anúncios no Brasil e no México (3% no padrão global). Nos dois casos é taxa de acesso à plataforma, não comissão de gestão do imóvel. Fonte: Central de Ajuda do Airbnb, artigo 1857.",
    },
    {
      q: "Quanto o Airbnb cobra do hóspede?",
      a: "No modelo dividido, o hóspede paga uma taxa de serviço separada, de 14,1% a 16,5% do subtotal da reserva, que varia com fatores como duração da estadia e moeda de pagamento. No modelo de taxa única, essa cobrança sai da conta do hóspede e passa inteira para o anfitrião.",
    },
    {
      q: "A comissão de uma gestora é a mesma coisa que a taxa do Airbnb?",
      a: "Não. A taxa do Airbnb paga só o acesso à plataforma. A comissão de uma gestora paga a operação do imóvel — precificação, atendimento, curadoria, manutenção, financeiro. São cobranças diferentes, de fontes diferentes, por serviços diferentes.",
    },
    {
      q: "Vale a pena pagar comissão para uma gestora profissional?",
      a: "Depende do que a comissão cobre e do resultado que sustenta. Comissão baixa com operação fraca custa mais em vacância e avaliação ruim do que comissão justa com operação que funciona. Avalie o que está incluído, não só o percentual.",
    },
    {
      q: "Como saber se a comissão de uma gestora é justa?",
      a: "Peça para a gestora detalhar o que a comissão cobre — precificação, atendimento, curadoria, manutenção — e compare com o resultado que ela sustenta, não só o número. Avalie seu imóvel sem compromisso para ver o que o percentual aplicável ao seu caso cobre.",
    },
  ],
  related: [
    "quanto-rende-apartamento-airbnb-sao-paulo",
    "quanto-rende-casa-airbnb-sao-paulo",
    "como-escolher-empresa-gestao-airbnb",
  ],
};

function Content() {
  return (
    <>
      <h2>Resposta direta</h2>
      <p>
        O Airbnb cobra uma <strong>taxa de serviço</strong>, não uma &ldquo;comissão de gestão&rdquo;. No modelo de
        taxa única, quem tem acomodação no Brasil paga <strong>16% sobre o subtotal da reserva</strong> (a maioria dos
        anfitriões no mundo paga 15,5%; a faixa vai de 14% a 16%), e a cobrança recai só sobre o anfitrião. Essa taxa
        compra o acesso à plataforma. Ela não paga ninguém para cuidar do seu imóvel: isso é o que uma gestora cobra
        por fora, em serviço.
      </p>

      <h2>Qual é a taxa de serviço do Airbnb hoje?</h2>
      <p>
        Existem dois modelos em vigor ao mesmo tempo, e a diferença entre eles muda a sua conta. No{" "}
        <strong>modelo de taxa única</strong>, o anfitrião paga tudo: 16% no Brasil, 15,5% na maior parte do mundo, e o
        hóspede não vê taxa de serviço separada. No <strong>modelo dividido</strong>, mais antigo, a conta se reparte: o
        anfitrião paga 3% no padrão global, mas <strong>4% em anúncios no Brasil e no México</strong>, e o hóspede paga
        de 14,1% a 16,5% do subtotal, variando com duração da estadia e moeda.
      </p>
      <p>
        Repare no detalhe que a maior parte do conteúdo em português erra: no modelo dividido, a taxa do anfitrião
        brasileiro é 4%, não 3%. O Airbnb migra os anfitriões que ainda estão no formato antigo para o de taxa única, e
        não publica data de conclusão dessa migração. Fonte: Central de Ajuda do Airbnb, artigo &ldquo;Taxas de serviço
        do Airbnb&rdquo; (artigo 1857), consultado em 28 de julho de 2026.
      </p>
      <p>
        Antes de fazer qualquer projeção com esses números, confira em qual dos dois modelos o seu anúncio está. Os
        percentuais mudaram mais de uma vez desde 2025.
      </p>

      <h2>Taxa do Airbnb x comissão de uma gestora — são coisas diferentes</h2>
      <p>
        A taxa de serviço do Airbnb paga o acesso à plataforma, o processamento de pagamento e o suporte básico — não
        paga ninguém para cuidar do seu imóvel. A comissão de uma gestora profissional é outra conta: cobre
        precificação dinâmica, atendimento ao hóspede, coordenação de limpeza e manutenção, curadoria de quem entra no
        imóvel e o relacionamento com o proprietário. São duas taxas empilhadas, com funções diferentes — comparar só o
        percentual de uma ignora o que cada uma entrega.
      </p>
      <p>
        A WeCare opera com um modelo de comissão transparente, sem taxa oculta: o percentual é definido na avaliação do
        imóvel e cobre a operação completa, ponta a ponta — sem custo &ldquo;surpresa&rdquo; depois que o contrato já
        está em vigor.
      </p>

      <h2>O que compõe o custo total de ter um imóvel no Airbnb com gestão profissional</h2>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Camada de custo</th>
              <th>O que cobre</th>
              <th>Quem cobra</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Taxa de serviço do Airbnb</td>
              <td>Acesso à plataforma, pagamento, seguro básico da reserva</td>
              <td>Airbnb (plataforma)</td>
            </tr>
            <tr>
              <td>Comissão da gestora</td>
              <td>Precificação, atendimento 24h, curadoria de hóspede, coordenação de limpeza/manutenção, financeiro</td>
              <td>Empresa de gestão (ex.: WeCare)</td>
            </tr>
            <tr>
              <td>Custos variáveis operacionais</td>
              <td>Limpeza entre estadias, manutenção corretiva, reposição de itens</td>
              <td>Repassado ao proprietário ou incluído no contrato, depende do modelo</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Essas três camadas juntas — não só a taxa do Airbnb — determinam o quanto sobra líquido para o proprietário.
        Quanto pode entrar antes dessas camadas está detalhado em{" "}
        <Link href="/blog/quanto-rende-apartamento-airbnb-sao-paulo">quanto rende um apartamento no Airbnb em São Paulo</Link>{" "}
        e em <Link href="/blog/quanto-rende-casa-airbnb-sao-paulo">quanto rende uma casa</Link>. Comparar gestoras só
        pelo percentual de comissão, sem olhar o que está incluído em cada uma, é comparação incompleta.
      </p>

      <h2>Por que comparar só a taxa de serviço do Airbnb não conta a história toda</h2>
      <p>
        Um percentual de comissão mais baixo não significa resultado melhor se a operação por trás for fraca — resposta
        lenta ao hóspede, precificação estática, manutenção reativa custam mais em avaliação ruim e vacância do que
        qualquer diferença de 2 ou 3 pontos percentuais de comissão. A pergunta certa não é &ldquo;qual a menor
        comissão&rdquo;, é &ldquo;o que essa comissão entrega&rdquo;. A WeCare mede isso pelo resultado que sustenta:
        churn abaixo de 1% ao mês e clientes que ficam, em média, 5 a 6 anos — não é preço baixo que retém
        proprietário, é operação que funciona.
      </p>

      <h2>O que a WeCare não faz: prometer economia inflada trocando de gestora</h2>
      <p>
        Não comparamos comissão com concorrentes nomeados nem prometemos &ldquo;a menor taxa do mercado&rdquo; — isso
        não é o que decide o resultado líquido do proprietário. Cada avaliação de imóvel mostra o percentual aplicável
        e o que ele cobre, antes de qualquer decisão. Sabendo o custo, o passo seguinte é o critério:{" "}
        <Link href="/blog/como-escolher-empresa-gestao-airbnb">como escolher uma empresa de gestão de Airbnb</Link>.
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
    </>
  );
}

export const post: BlogPost = { meta, Content };
