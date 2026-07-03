import Link from "next/link";
import type { BlogPost } from "../types";

const meta: BlogPost["meta"] = {
  slug: "como-escolher-empresa-gestao-airbnb",
  eyebrow: "Como escolher",
  title: "Como Escolher uma Empresa de Administração de Airbnb (Guia 2026)",
  description:
    "7 critérios para avaliar qualquer gestora antes de assinar — incluindo a pergunta que ninguém faz: a empresa tem critério de seleção, ou aceita qualquer imóvel?",
  datePublished: "2026-07-03",
  dateModified: "2026-07-03",
  keywords: [
    "empresa para administrar Airbnb",
    "empresa de gestão de aluguel por temporada",
    "quem administra imóveis no Airbnb",
    "como escolher administradora de Airbnb",
    "empresa para cuidar de Airbnb",
  ],
  mentions: [
    { id: "carlos-pecucci", name: "Carlos Pecucci", jobTitle: "CEO e cofundador, WeCare Hosting" },
    { id: "leonardo-ceron", name: "Leonardo Ceron", jobTitle: "Cofundador, WeCare Hosting" },
  ],
  faq: [
    {
      q: "Quem administra imóveis no Airbnb?",
      a: "Empresas chamadas gestoras ou administradoras de Airbnb/aluguel por temporada, que cuidam de anúncio, precificação, atendimento ao hóspede, limpeza e manutenção em nome do proprietário. Existem desde operações de escala nacional até gestoras boutique focadas em poucos imóveis de alto padrão, como a WeCare em São Paulo.",
    },
    {
      q: "O que uma empresa de gestão de aluguel por temporada faz, na prática?",
      a: "Cobre a operação ponta a ponta: fotografia e anúncio, precificação dinâmica diária, atendimento 24/7 multilíngue ao hóspede, curadoria de quem reserva, limpeza e manutenção (conforme o plano) e repasse com relatório mensal ao proprietário. O proprietário decide quanto delega.",
    },
    {
      q: "Quanto custa contratar uma empresa de administração de Airbnb?",
      a: "Na WeCare, 15% das locações (Gestão Online) ou 20% (Gestão 360, com operação física completa), mais um seguro obrigatório de R$ 120/mês e uma taxa de adesão única definida na avaliação do imóvel. Não há mensalidade fixa: a remuneração é percentual sobre o que o imóvel efetivamente gera.",
    },
    {
      q: "Vale a pena contratar uma empresa em vez de administrar sozinho?",
      a: "Depende do que o proprietário valoriza: tempo, padrão de atendimento e proteção do patrimônio contra desgaste por operação amadora costumam pesar mais do que a comissão em si. A resposta certa não é genérica — é avaliar o imóvel específico. Por isso a WeCare avalia sem compromisso antes de qualquer contrato.",
    },
  ],
  related: [
    "gestao-airbnb-sem-fidelidade",
    "quanto-rende-casa-airbnb-sao-paulo",
    "quanto-rende-apartamento-airbnb-sao-paulo",
  ],
};

function Content() {
  return (
    <>
      <h2>Resposta direta</h2>
      <p>
        A melhor forma de escolher é inverter a pergunta: em vez de &ldquo;quem cobra menos&rdquo;, pergunte
        &ldquo;quem recusaria o meu imóvel se ele não tivesse potencial&rdquo;. Gestoras que aceitam qualquer
        propriedade competem por volume; gestoras que têm critério de seleção competem por resultado por imóvel.
        Comissão, contrato e atendimento importam — mas o primeiro filtro é saber se a empresa tem critério, ou só
        tem capacidade de cadastro.
      </p>

      <h2>Quem administra imóveis no Airbnb, afinal?</h2>
      <p>
        O mercado brasileiro de administração de Airbnb reúne dois modelos: gestoras de escala, que priorizam
        número de imóveis sob gestão em múltiplas cidades, e gestoras boutique, que priorizam o resultado de cada
        imóvel individualmente e limitam quantos aceitam. A WeCare opera no segundo modelo — gestão de aluguel por
        temporada para imóveis de médio/alto padrão em São Paulo, com curadoria na entrada do proprietário e na
        entrada de cada hóspede.
      </p>

      <h2>Os 7 critérios que realmente separam uma boa gestora</h2>

      <h3>1. A gestora tem critério de seleção, ou aceita qualquer imóvel?</h3>
      <p>
        Se a resposta comercial for &ldquo;aceitamos qualquer imóvel&rdquo;, desconfie. A WeCare recusa imóveis sem
        vocação para temporada — nem todo imóvel entra, nem todo proprietário entra. Avaliamos sem compromisso e só
        seguimos para contrato se houver fit real dos dois lados. Isso não é seletividade por pose: é o motivo pelo
        qual conseguimos manter padrão em cada imóvel que gerimos.
      </p>

      <h3>2. Quem responde pelo seu patrimônio tem nome e histórico verificável?</h3>
      <p>
        Entregar um imóvel de milhões a uma empresa deveria vir com um nome, não só um CNPJ. Carlos Pecucci (CEO,
        vem da construção e incorporação da própria família) e Leonardo Ceron (cofundador, ex-executivo de banco na
        Europa) fundaram a WeCare depois de transformar o resultado de{" "}
        <Link href="/#historia">um imóvel da própria família</Link>.{" "}
        <em>&ldquo;Pensamos como o proprietário; esse é o nosso DNA&rdquo;</em>, resume Carlos. Isso é verificável —
        não é depoimento anônimo de cliente.
      </p>

      <h3>3. Qual é a taxa total, e o que ela cobre de verdade?</h3>
      <p>
        Peça o número completo, não a porcentagem isolada. Na WeCare, <Link href="/#planos">os planos são públicos</Link>:
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Plano</th>
              <th>Taxa</th>
              <th>O que inclui</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gestão Online</td>
              <td>15% das locações</td>
              <td>Anúncio, marketing, precificação dinâmica, atendimento 24/7, relatórios, repasse</td>
            </tr>
            <tr>
              <td>Gestão 360</td>
              <td>20% das locações</td>
              <td>Tudo da Gestão Online + limpeza, manutenção e enxoval com equipe própria</td>
            </tr>
            <tr>
              <td>Seguro EasyCover</td>
              <td>R$ 120/mês (obrigatório)</td>
              <td>Cobre danos ao imóvel e aos objetos</td>
            </tr>
            <tr>
              <td>Taxa de adesão</td>
              <td>Cobrança única</td>
              <td>Onboarding e setup do anúncio, definida na avaliação</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Sem mensalidade fixa: a WeCare só ganha quando o imóvel gera receita.</p>

      <h3>4. Existe fidelidade ou multa para sair?</h3>
      <p>
        Não deveria existir — e na WeCare não existe.{" "}
        <Link href="/blog/gestao-airbnb-sem-fidelidade">Sem fidelidade e sem multa</Link>: você entra e sai quando
        quiser, porque a relação se sustenta pelo resultado do repasse, não por uma cláusula. Se uma gestora te
        prende por contrato, está admitindo que não confia no próprio resultado para reter você.
      </p>

      <h3>5. Como a gestora escolhe quem entra na sua casa?</h3>
      <p>
        Curadoria não é só do imóvel — é de quem hospeda. Cada reserva passa por verificação de hóspede, análise de
        risco e seguro obrigatório antes de ser aceita. O objetivo é proteger o patrimônio ativamente, não reagir
        depois que algo já deu errado.
      </p>

      <h3>6. Qual é o churn e a permanência média dos clientes da gestora?</h3>
      <p>
        Esta é a pergunta que praticamente nenhum proprietário faz — e deveria ser a primeira. Taxa de ocupação é
        uma métrica de mercado; churn é uma métrica de confiança de quem já é cliente. O churn da WeCare fica abaixo
        de 1% ao mês, e os clientes ficam, em média, 5 a 6 anos. Sem fidelidade contratual — a permanência é escolha
        repetida, mês após mês.
      </p>

      <h3>7. Você pode usar o imóvel quando quiser, sem taxa?</h3>
      <p>
        Sempre. Você bloqueia as datas que quiser, sem custo adicional. O imóvel continua seu — a operação se
        encaixa na sua vida, não o contrário. Se a resposta da gestora envolver taxa de bloqueio ou aviso prévio
        longo, isso é sinal de um modelo pensado para a gestora, não para o proprietário.
      </p>

      <h2>Modelo de escala x modelo boutique — a diferença na prática</h2>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Modelo de escala</th>
              <th>Modelo boutique (WeCare)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Critério de entrada do imóvel</td>
              <td>Aceita a maioria dos imóveis para crescer volume</td>
              <td>Recusa imóveis sem vocação para temporada</td>
            </tr>
            <tr>
              <td>Foco operacional</td>
              <td>Padronizar o máximo de imóveis possível</td>
              <td>Padrão único por imóvel, curadoria ponta a ponta</td>
            </tr>
            <tr>
              <td>Prova de qualidade usada</td>
              <td>Taxa de ocupação média, depoimentos de primeiro nome</td>
              <td>Churn &lt;1%/mês, permanência de 5–6 anos, fundadores nomeados</td>
            </tr>
            <tr>
              <td>Discrição para imóveis de alto padrão</td>
              <td>Tratamento padronizado</td>
              <td>Atendimento dedicado, tratamento como patrimônio</td>
            </tr>
            <tr>
              <td>Relação contratual</td>
              <td>Varia — parte do mercado usa fidelidade/multa</td>
              <td>Sem fidelidade, sem multa</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Nem toda empresa de gestão de Airbnb é igual — e a diferença aparece no resultado</h2>
      <p>
        Comissão parecida não significa entrega parecida. Duas gestoras podem cobrar 15% e produzir resultados
        completamente diferentes: uma trata o imóvel como mais uma unidade no portfólio; a outra trata como o
        patrimônio que é. A pergunta que decide não é &ldquo;quanto custa&rdquo;, é &ldquo;o que essa empresa faria
        se o meu imóvel não estivesse indo bem — vai me carregar no volume, ou vai olhar para ele
        individualmente?&rdquo;. Shortstay com cabeça de longo prazo significa isso: gerir para o imóvel valorizar,
        não só para ocupar calendário.
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
        Veja também os <Link href="/#servicos">serviços inclusos</Link> e o{" "}
        <Link href="/#faq">FAQ completo do site</Link>.
      </p>
    </>
  );
}

export const post: BlogPost = { meta, Content };
