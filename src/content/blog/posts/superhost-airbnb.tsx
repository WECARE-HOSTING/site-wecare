import Link from "next/link";
import type { BlogPost } from "../types";

const meta: BlogPost["meta"] = {
  slug: "superhost-airbnb",
  eyebrow: "Superhost",
  title: "Superhost no Airbnb: os 4 Critérios e Como Manter",
  description:
    "O selo é reavaliado a cada 3 meses em 4 critérios: nota 4,8, resposta de 90% em 24h, cancelamento abaixo de 1% e 10 estadias no ano.",
  datePublished: "2026-07-06",
  dateModified: "2026-07-28",
  keywords: [
    "superhost",
    "selo superhost airbnb",
    "requisitos superhost",
    "como ser superhost",
    "virar superhost",
    "gestão de airbnb superhost",
  ],
  faq: [
    {
      q: "O que é preciso para ser superhost no Airbnb?",
      a: "O Airbnb exige 4 critérios simultâneos, avaliados a cada 3 meses: nota geral de 4,8 ou mais, taxa de resposta de 90% ou mais em até 24h, taxa de cancelamento abaixo de 1% e um mínimo de 10 estadias concluídas (ou 3 estadias somando 100 noites ou mais). Falhar em um único critério já tira o selo.",
    },
    {
      q: "Preciso ser superhost para contratar uma empresa de gestão de Airbnb?",
      a: "Não. Superhost é um status de desempenho do anúncio no Airbnb — contratar uma gestora de aluguel por temporada não exige nenhum selo prévio do proprietário. A maior parte dos proprietários contrata justamente para não precisar construir esse histórico sozinho.",
    },
    {
      q: "Uma empresa de gestão consegue status de superhost mais rápido que eu, sozinho?",
      a: "Em geral, sim. O critério de volume é mais fácil de bater operando dezenas de imóveis com processo padronizado do que administrando 1 ou 2 imóveis sozinho — e anúncios em que o anfitrião atua só como co-anfitrião não contam para a elegibilidade a superhost de quem administra (Airbnb Help Center, artigo 829).",
    },
    {
      q: "Vale a pena virar superhost sozinho ou contratar uma gestora profissional?",
      a: "Depende do volume de imóveis e do tempo disponível. Para 1 imóvel, um proprietário atento consegue manter os 4 critérios sozinho. Para mais de um imóvel, ou sem rotina de responder mensagens em minutos, uma gestora profissional reduz o risco de perder o selo — e costuma chegar lá mais rápido.",
    },
  ],
  related: ["como-escolher-empresa-gestao-airbnb", "co-hosting-airbnb", "anfitriao-profissional-airbnb"],
};

function Content() {
  return (
    <>
      <h2>Resposta direta</h2>
      <p>
        Superhost é o selo trimestral do Airbnb para anfitriões que batem 4 critérios simultâneos de desempenho:
        nota 4,8+, resposta de 90% em 24h, cancelamento abaixo de 1% e volume mínimo de estadias. Não é obrigatório
        para contratar uma gestora — é o contrário: uma gestora profissional geralmente chega ao selo mais rápido e
        o mantém em toda a carteira, não só num imóvel isolado.
      </p>

      <h2>O que é preciso para ser superhost no Airbnb?</h2>
      <p>
        O Airbnb exige 4 critérios simultâneos, avaliados a cada 3 meses sobre os últimos 12 meses: nota geral de
        4,8 ou mais, taxa de resposta de 90% ou mais em até 24h, taxa de cancelamento do anfitrião abaixo de 1% e um
        mínimo de 10 estadias concluídas (ou 3 estadias somando 100 noites ou mais). Falhar em um único critério já
        tira o selo.
      </p>
      <p>Os 4 requisitos oficiais (fonte: Airbnb Help Center, artigo 829, verificado em 2026-07-06):</p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Critério</th>
              <th>Exigência do Airbnb</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nota geral</td>
              <td>4,8 ou mais (média ponderada dos últimos 12 meses)</td>
            </tr>
            <tr>
              <td>Taxa de resposta</td>
              <td>90% ou mais das novas mensagens respondidas em até 24h</td>
            </tr>
            <tr>
              <td>Taxa de cancelamento</td>
              <td>Menor que 1% das reservas (exceções para força maior)</td>
            </tr>
            <tr>
              <td>Volume mínimo</td>
              <td>10 estadias concluídas, ou 3 estadias somando 100+ noites</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        O status vale só para quem é o próprio anunciante do imóvel — anúncios em que o anfitrião atua apenas como
        co-anfitrião não contam para essa elegibilidade. A avaliação acontece 4 vezes por ano (1º de janeiro, abril,
        julho e outubro); quem bate os 4 números é promovido automaticamente, sem inscrição.
      </p>

      <h2>Preciso ser superhost para contratar uma empresa de gestão de Airbnb?</h2>
      <p>
        Não. Superhost é um status de desempenho do anúncio no Airbnb — contratar uma gestora de aluguel por
        temporada não exige nenhum selo prévio do proprietário. Na prática é o oposto do que muita gente assume: a
        maior parte dos proprietários contrata justamente para não precisar construir esse histórico sozinho, mês a
        mês.
      </p>
      <p>
        Um imóvel novo no Airbnb, sem nenhum histórico de avaliação, entra para gestão do mesmo jeito. A WeCare
        Hosting avalia o imóvel e o proprietário antes de assinar contrato — o critério de entrada é a vocação do
        imóvel para temporada, não o histórico prévio de selo. O selo, quando existe, passa a ser resultado da
        operação depois que a gestão começa — não pré-requisito para começar.
      </p>

      <h2>Uma empresa de gestão de Airbnb consegue status de superhost mais rápido que eu?</h2>
      <p>
        Em geral, sim. O critério de volume (10 estadias, ou 3 somando 100 noites, por trimestre) é mais fácil de
        bater operando dezenas de imóveis com processo padronizado do que administrando 1 ou 2 imóveis sozinho — e
        os outros 3 critérios (nota, resposta, cancelamento) também se beneficiam de rotina profissionalizada em vez
        de esforço manual e inconstante.
      </p>
      <p>
        Existe um detalhe técnico do próprio Airbnb que reforça esse ponto: anúncios em que o anfitrião atua só como
        co-anfitrião (função de apoio) não contam para a elegibilidade a superhost de quem administra — o status
        pertence à conta que figura como anfitriã do anúncio (fonte: Airbnb Help Center, artigo 829). Por isso,
        gestoras que operam o imóvel de ponta a ponta constroem um histórico consistente em toda a carteira, em vez
        de depender do ritmo mais lento e isolado de cada proprietário sozinho. A WeCare Hosting mantém status
        superhost há 10 anos — resultado direto de resposta padronizada, checklist de limpeza e curadoria de hóspede
        aplicados a toda a carteira, não a um imóvel isolado.
      </p>

      <h2>Vale a pena virar superhost sozinho ou contratar uma gestora profissional?</h2>
      <p>
        Depende do volume de imóveis e do tempo disponível. Para 1 imóvel, um proprietário atento e presente
        consegue manter os 4 critérios sozinho. Para mais de um imóvel, ou para quem não tem rotina de responder
        mensagens em minutos e sincronizar calendário todo dia, uma gestora profissional reduz o risco de perder o
        selo — e costuma chegar lá mais rápido.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Sozinho (1 imóvel)</th>
              <th>Gestora profissional (carteira)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Resposta em até 24h</td>
              <td>Depende da disponibilidade pessoal do proprietário</td>
              <td>Equipe dedicada, resposta em minutos</td>
            </tr>
            <tr>
              <td>Volume mínimo trimestral</td>
              <td>Pode levar mais de 1 ano com baixa ocupação</td>
              <td>Atingido rápido em escala consolidada</td>
            </tr>
            <tr>
              <td>Sincronização de calendário</td>
              <td>Manual, risco de overbooking por erro humano</td>
              <td>Automatizada entre plataformas</td>
            </tr>
            <tr>
              <td>Nota 4,8+</td>
              <td>Vulnerável a poucas avaliações ruins</td>
              <td>Protegida por processo padronizado de limpeza e check-in</td>
            </tr>
            <tr>
              <td>Curadoria de hóspede antes da reserva</td>
              <td>Depende do critério individual do proprietário</td>
              <td>Parte do processo, aplicada a cada reserva</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Nenhuma das duas opções está errada — a decisão certa depende de quanto tempo o proprietário quer (ou pode)
        dedicar à operação diária.
      </p>

      <h2>Quais vantagens o status de superhost traz para o proprietário do imóvel?</h2>
      <p>
        O selo aumenta a visibilidade do anúncio nas buscas do Airbnb, sinaliza confiança ao hóspede antes da
        reserva e dá acesso a benefícios do próprio Airbnb para o anfitrião, como prioridade no suporte e
        recompensas exclusivas (fonte: Airbnb Help Center, artigo 828). Ele não garante reserva automática —
        funciona como multiplicador de um anúncio que já é bom.
      </p>
      <p>
        O badge aparece no anúncio e no perfil do anfitrião. Hóspedes usam o filtro &ldquo;Superhost&rdquo; na busca
        — quem não tem o selo simplesmente não aparece nesse recorte. Para o proprietário, isso se traduz em mais
        visitas ao anúncio e mais confiança na decisão de reserva, sem custo adicional nenhum para manter (o selo é
        concedido automaticamente, sem taxa). O ponto de atenção: o selo amplifica um bom imóvel e um bom
        atendimento — não substitui nenhum dos dois.
      </p>

      <h2>Empresas de gestão de Airbnb no Brasil mantêm status de superhost para os imóveis administrados?</h2>
      <p>
        Depende da gestora e de como ela estrutura a operação — não é automático nem garantido por lei ou pelo
        Airbnb. A WeCare Hosting mantém selo superhost há 10 anos na operação, resultado de resposta rápida
        padronizada, checklist de limpeza e curadoria de hóspede aplicados à carteira inteira — não a imóveis
        isolados.
      </p>
      <p>
        Isso não é regra do mercado: cada gestora tem processo próprio, e o selo depende dos mesmos 4 critérios
        objetivos do Airbnb, aplicados de forma consistente em cada imóvel administrado. Antes de contratar, vale
        perguntar diretamente: há quanto tempo a gestora mantém o selo, e em quantos imóveis da carteira? Uma
        resposta vaga (&ldquo;a maioria dos nossos imóveis tem o selo&rdquo;) é diferente de um histórico datado e
        verificável.
      </p>

      <h2>Superhost não substitui critério — é consequência dele</h2>
      <p>
        Ter o selo é sinal de operação consistente, não de que qualquer imóvel deveria estar no Airbnb ou de que
        qualquer gestora merece confiança. Shortstay com cabeça de longo prazo significa tratar o selo como
        resultado de um processo bem feito — resposta rápida, limpeza padronizada, curadoria de hóspede — e não como
        o único critério para escolher quem vai cuidar do seu patrimônio.
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
        Veja também <Link href="/blog/co-hosting-airbnb">a diferença entre anfitrião e co-anfitrião</Link> e{" "}
        <Link href="/blog/como-escolher-empresa-gestao-airbnb">como escolher uma empresa de administração de Airbnb</Link>.
      </p>
    </>
  );
}

export const post: BlogPost = { meta, Content };
