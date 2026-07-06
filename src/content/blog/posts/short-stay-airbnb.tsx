import Link from "next/link";
import type { BlogPost } from "../types";

const meta: BlogPost["meta"] = {
  slug: "short-stay-airbnb",
  eyebrow: "Short stay",
  title: "Short Stay: o Que É, Como Funciona e Vale a Pena em 2026",
  description:
    "Definição, diferença para aluguel tradicional, dado real de mercado (Airbtics) e a decisão do STJ de 2026 que muda a regra em condomínios.",
  datePublished: "2026-07-06",
  dateModified: "2026-07-06",
  keywords: [
    "short stay",
    "o que é short stay",
    "gestão de short stay no Brasil",
    "short stay São Paulo",
    "short stay x aluguel tradicional",
    "regulamentação short stay",
  ],
  faq: [
    {
      q: "O que é short stay?",
      a: "É o aluguel de imóvel por curta temporada — estadias de até 90 dias, mobiliadas, reservadas online. No Brasil, é regido pela locação por temporada da Lei do Inquilinato, não por uma lei própria.",
    },
    {
      q: "Short stay é a mesma coisa que Airbnb?",
      a: "Não. Airbnb é uma plataforma de reserva; short stay é o modelo de locação. Um imóvel pode estar em regime de short stay e ser anunciado no Airbnb, na Booking ou nos dois ao mesmo tempo — quanto mais canais, menor a dependência de um só.",
    },
    {
      q: "Preciso de autorização do condomínio para operar short stay?",
      a: "Cada vez mais, sim, na prática. O STJ decidiu em 2026 que a operação reiterada por plataforma digital pode exigir aprovação de dois terços dos condôminos. Verificar a convenção antes de anunciar deixou de ser um detalhe opcional.",
    },
    {
      q: "O mercado de short stay em São Paulo ainda está crescendo?",
      a: "Em receita, sim: +11,9% ao ano, com diária 20% maior (Airbtics, dados até jan/2026). Em ocupação, está mais disputado: a oferta de anúncios cresceu 39% no mesmo período. As duas coisas acontecem juntas.",
    },
    {
      q: "Vale mais a pena administrar sozinho ou contratar uma gestora?",
      a: "Depende do que o proprietário valoriza: tempo, padrão de atendimento e proteção do imóvel contra o desgaste da operação amadora costumam pesar mais do que a comissão da gestora. A resposta certa é avaliar o imóvel específico — por isso a WeCare avalia sem compromisso antes de qualquer contrato.",
    },
  ],
  related: ["como-escolher-empresa-gestao-airbnb", "locacao-por-temporada", "quanto-rende-apartamento-airbnb-sao-paulo"],
};

function Content() {
  return (
    <>
      <h2>Resposta direta</h2>
      <p>
        Short stay é o aluguel de imóvel por curta temporada — estadias de até 90 dias, mobiliadas, reservadas online
        via Airbnb ou Booking. No Brasil, é regido pela locação por temporada da Lei do Inquilinato (Lei 8.245/91,
        arts. 48–50), não por uma lei própria de &ldquo;short stay&rdquo;. O proprietário pode operar sozinho ou
        contratar uma gestora, que cuida do anúncio, da precificação e do hóspede mediante comissão.
      </p>

      <h2>O que é short stay e como funciona no Brasil?</h2>
      <p>
        Short stay é o termo em inglês para locação por temporada: contratos curtos (normalmente até 90 dias), diária
        cobrada antecipadamente, imóvel entregue mobiliado e pronto para uso, e reserva feita por plataforma digital.
        No Brasil, o modelo cresceu junto com o Airbnb a partir de 2018 e se consolidou depois da pandemia, quando
        viagem corporativa, tratamento médico e trabalho remoto passaram a demandar estadias intermediárias — nem
        hotel, nem aluguel de 30 meses. Isso não é o mesmo que &ldquo;estar no Airbnb&rdquo;: Airbnb é a plataforma de
        reserva, e short stay é o modelo de locação — um imóvel pode operar em regime de short stay e ser anunciado
        no Airbnb, na Booking ou nos dois ao mesmo tempo.
      </p>
      <p>
        Juridicamente, short stay não é uma categoria própria: é locação por temporada, prevista nos artigos 48 a 50
        da Lei do Inquilinato (Lei 8.245/91), que exige finalidade residencial transitória e a descrição dos móveis e
        utensílios do imóvel no contrato. Isso é diferente de atividade hoteleira, que pressupõe serviços como
        concierge, lavanderia e alimentação, além de licença específica — distinção que passou a importar mais depois
        da decisão do STJ de 2026 (ver seção sobre regulamentação, abaixo).
      </p>

      <h2>Quem faz gestão de short stay no Brasil, e como escolher uma empresa confiável em São Paulo</h2>

      <h3>Quais empresas fazem gestão de short stay no Brasil?</h3>
      <p>
        O mercado brasileiro de gestão de short stay reúne dois tipos de operador: startups de tecnologia com aporte,
        que administram prédios inteiros (unidades próprias ou de incorporadoras parceiras) sob um contrato
        padronizado de short stay/long stay; e gestoras profissionais, que atendem imóveis de terceiros, proprietário
        por proprietário, com curadoria e atendimento dedicado. A WeCare opera no segundo grupo — gestão de short
        stay para imóveis de médio/alto padrão em São Paulo, com curadoria na entrada do proprietário e na entrada de
        cada hóspede.
      </p>

      <h3>Quais as melhores empresas de gestão de short stay em São Paulo?</h3>
      <p>
        Não existe ranking objetivo e verificável de &ldquo;melhores empresas&rdquo; — qualquer lista publicada por
        uma gestora sobre si mesma é autopromoção, não avaliação independente. A pergunta certa é outra: quais
        critérios separam uma boa gestora de uma que só cadastra imóveis? Critério de seleção do imóvel,
        transparência total de taxa, ausência de fidelidade e churn baixo e comprovável são os quatro que realmente
        importam — veja a tabela abaixo.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Critério</th>
              <th>O que perguntar</th>
              <th>Padrão WeCare</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Critério de seleção</td>
              <td>A gestora recusa imóvel sem potencial, ou aceita qualquer um para crescer volume?</td>
              <td>Recusa imóveis sem vocação para temporada — avaliação sem compromisso antes do contrato</td>
            </tr>
            <tr>
              <td>Transparência de taxa</td>
              <td>O número informado é o total, ou só a comissão &ldquo;de vitrine&rdquo;?</td>
              <td>15% (Gestão Online) ou 20% (Gestão 360), sem mensalidade fixa</td>
            </tr>
            <tr>
              <td>Fidelidade contratual</td>
              <td>Existe multa ou prazo mínimo para sair?</td>
              <td>Sem fidelidade, sem multa — 30 dias de aviso prévio</td>
            </tr>
            <tr>
              <td>Churn e permanência</td>
              <td>A gestora divulga o próprio churn, ou só taxa de ocupação de mercado?</td>
              <td>Churn abaixo de 1% ao mês, permanência média de 5 a 6 anos</td>
            </tr>
            <tr>
              <td>Autoridade verificável</td>
              <td>Quem responde pelo seu patrimônio tem nome e histórico público?</td>
              <td>Carlos Pecucci e Leonardo Ceron, fundadores nomeados e verificáveis</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Como escolher uma operadora de short stay confiável?</h3>
      <p>
        Confiável, na prática, significa três coisas verificáveis: a gestora recusa imóveis sem potencial (tem
        critério, não só capacidade de cadastro); ela conhece o risco condominial e jurídico do short stay —
        inclusive a exigência recente do STJ sobre aprovação em assembleia — e orienta o proprietário antes de
        operar; e ela mede a própria retenção (churn, permanência), não só a ocupação média do mercado. Peça os três
        dados antes de assinar qualquer contrato.
      </p>

      <h2>Qual a diferença entre short stay e aluguel tradicional?</h2>
      <p>
        A diferença central é prazo e forma de contrato. Short stay tem estadias de até 90 dias, cobrança por diária,
        imóvel mobiliado e contrato simplificado de locação por temporada. Aluguel tradicional segue a locação
        residencial comum da Lei do Inquilinato, com prazo típico de 30 meses, cobrança mensal fixa e imóvel
        geralmente sem mobília. O long stay fica entre os dois: de 90 dias a 12 meses.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Short stay</th>
              <th>Long stay</th>
              <th>Aluguel tradicional</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Duração</td>
              <td>Até 90 dias</td>
              <td>90 dias a 12 meses</td>
              <td>Normalmente 30 meses</td>
            </tr>
            <tr>
              <td>Cobrança</td>
              <td>Por diária</td>
              <td>Mensal</td>
              <td>Mensal</td>
            </tr>
            <tr>
              <td>Mobília</td>
              <td>Completa, incluída</td>
              <td>Geralmente mobiliado</td>
              <td>Geralmente sem mobília</td>
            </tr>
            <tr>
              <td>Base legal</td>
              <td>Locação por temporada (Lei 8.245/91, arts. 48–50)</td>
              <td>Locação residencial flexível</td>
              <td>Locação residencial (Lei do Inquilinato)</td>
            </tr>
            <tr>
              <td>Uso do proprietário</td>
              <td>Livre, bloqueando datas</td>
              <td>Restrito ao contrato vigente</td>
              <td>Nenhum durante o contrato</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        O motivo pelo qual o short stay costuma superar o aluguel tradicional em receita não é mágico: é diária maior
        compensando a rotatividade, quando a gestão é boa. É o caso documentado da própria WeCare — um imóvel da
        família que rendia R$ 3.500/mês em aluguel tradicional, reformado e colocado em regime de short stay com
        gestão profissional, passou a faturar R$ 30 mil/mês. Não é uma média de mercado; é um resultado específico,
        contado como caso.
      </p>

      <h2>Vale a pena investir em imóvel para short stay em 2026?</h2>
      <p>
        Sim, mas não como resposta genérica — como avaliação individual apoiada em dado real. A receita média por
        anúncio em São Paulo subiu 11,9% em 12 meses (Airbtics, dados até jan/2026), puxada por diária 20% maior. Ao
        mesmo tempo, o número de anúncios ativos cresceu 39% no mesmo período — mais oferta disputando o mesmo
        hóspede. Vale a pena para quem entra com padrão e gestão acima da média; fica mais difícil para quem entra
        sem diferencial.
      </p>
      <p>
        Essa combinação — receita subindo, oferta subindo mais rápido — é o motivo pelo qual &ldquo;colocar o imóvel
        no Airbnb&rdquo; deixou de ser suficiente sozinho. Curadoria de hóspede, precificação dinâmica diária e
        presença em mais de uma plataforma são o que separa um imóvel que captura a alta de diária de um imóvel que
        só sente a queda de ocupação. A WeCare não promete rentabilidade garantida — nenhuma gestora séria promete
        —, mas avalia cada imóvel individualmente antes de aceitar a gestão, exatamente por essa razão.
      </p>

      <h2>O mercado de short stay no Brasil está em alta ou em queda?</h2>
      <p>
        Em alta na receita, mais disputado na ocupação — as duas coisas ao mesmo tempo. Dados da Airbtics para São
        Paulo (referência fev/2025–jan/2026) mostram receita média subindo 11,9% ao ano e diária média subindo 20%,
        enquanto a taxa de ocupação caiu 6,2% no mesmo período, porque o número de anúncios ativos cresceu 39% em um
        ano. O mercado não está encolhendo: está ficando mais competitivo.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Indicador (São Paulo)</th>
              <th>Valor</th>
              <th>Variação em 12 meses</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Receita média anual por anúncio</td>
              <td>R$ 57 mil</td>
              <td>+11,9%</td>
            </tr>
            <tr>
              <td>Diária média (ADR)</td>
              <td>R$ 245</td>
              <td>+20,0%</td>
            </tr>
            <tr>
              <td>Taxa de ocupação</td>
              <td>61%</td>
              <td>−6,2%</td>
            </tr>
            <tr>
              <td>Anúncios ativos</td>
              <td>31.222</td>
              <td>+39,0%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="wc-source-note">
        Fonte: Airbtics, dados de referência fev/2025–jan/2026, atualizados em 12/03/2026.
      </p>
      <p>
        A leitura correta não é &ldquo;o mercado caiu&rdquo; nem &ldquo;o mercado está garantido&rdquo; — é que o
        anúncio médio, gerido de forma média, sente a concorrência crescente primeiro na ocupação. Quem
        profissionaliza a operação (curadoria, precificação ativa, multi-plataforma) tende a capturar a parte da
        equação que está subindo — a diária — em vez de só sentir a parte que está caindo.
      </p>

      <h2>Quanto rende um imóvel de short stay em São Paulo?</h2>
      <p>
        Não existe um número único por imóvel, mas existe um benchmark real e citável: a Airbtics registra receita
        mediana de R$ 57 mil por ano por anúncio em São Paulo, diária média de R$ 245 e ocupação de 61% (dados até
        jan/2026). Esse é o imóvel médio, gerido de forma média — o resultado de um imóvel específico, bem
        posicionado e bem operado, pode ficar acima ou abaixo dessa mediana.
      </p>
      <p>O que muda o resultado de um imóvel para outro, na prática:</p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Fator</th>
              <th>O que muda no resultado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Localização</td>
              <td>
                Bairros com demanda de negócios/turismo (ex.: Itaim Bibi, Jardins, entorno de eventos) sustentam
                diária mais alta e ocupação mais estável
              </td>
            </tr>
            <tr>
              <td>Padrão e reforma</td>
              <td>
                Um imóvel subutilizado, reformado com critério, muda de categoria de hóspede — é o que mudou os R$
                3.500 para R$ 30 mil no caso da WeCare
              </td>
            </tr>
            <tr>
              <td>Precificação dinâmica</td>
              <td>Preço fixo o ano todo deixa receita na mesa em alta temporada e ocupação vazia em baixa</td>
            </tr>
            <tr>
              <td>Curadoria de hóspede</td>
              <td>Reduz dano ao imóvel e sustenta avaliação alta, que por sua vez sustenta diária alta</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        A WeCare não publica tabela de rentabilidade prometida nem projeção fechada — dados reais e conservadores,
        nunca inflamos projeção para vender. A avaliação de cada imóvel é individual, antes de qualquer número.
      </p>

      <h2>Quais riscos existem em operar um imóvel de short stay?</h2>
      <p>
        Os quatro riscos que mais pesam são: risco condominial/jurídico (o STJ agora pode exigir aprovação de 2/3 da
        assembleia), dano ao imóvel por hóspede não verificado, queda de ocupação pelo aumento da oferta, e
        dependência de uma única plataforma de reserva. Nenhum deles é motivo para não operar — são motivo para
        operar com curadoria, seguro e gestão ativa, não sozinho e no impulso.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Risco</th>
              <th>Do que se trata</th>
              <th>Como mitigar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Condominial/jurídico</td>
              <td>
                STJ pode exigir aprovação de 2/3 dos condôminos quando a operação é lida como &ldquo;exploração
                econômica reiterada&rdquo; (REsp 2.121.055/MG, 2026)
              </td>
              <td>Verificar a convenção do condomínio antes de operar; gestoras experientes já leem esse risco prédio a prédio</td>
            </tr>
            <tr>
              <td>Dano ao imóvel</td>
              <td>Hóspede sem triagem pode danificar imóvel, mobília ou objetos</td>
              <td>Curadoria de hóspede + seguro obrigatório contratado antes de cada reserva</td>
            </tr>
            <tr>
              <td>Queda de ocupação</td>
              <td>Anúncios ativos em São Paulo cresceram 39% em 1 ano (Airbtics) — mais concorrência pelo mesmo hóspede</td>
              <td>Precificação dinâmica, padrão de imóvel e fotos acima da média, presença em mais de um canal</td>
            </tr>
            <tr>
              <td>Dependência de plataforma</td>
              <td>Ficar refém de uma única plataforma e das mudanças de política dela</td>
              <td>Multi-listing (Airbnb, Booking e outros) somado a canal de reserva direta próprio</td>
            </tr>
            <tr>
              <td>Tributário</td>
              <td>Renda tributada na tabela progressiva do IR, como pessoa física</td>
              <td>Declarar como &ldquo;rendimentos de aluguel&rdquo;; planejamento com contador quando o volume justificar</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Existe regulamentação específica para short stay no Brasil?</h2>
      <p>
        Não existe uma lei feita especificamente para &ldquo;short stay&rdquo; — a atividade se enquadra na locação
        por temporada, prevista nos artigos 48 a 50 da Lei do Inquilinato (Lei 8.245/91). Em 2026, porém, o STJ
        decidiu, por 5 votos a 4 (REsp 2.121.055/MG), que a exploração econômica reiterada de um imóvel via
        plataforma digital pode descaracterizar a destinação residencial do condomínio e passar a exigir aprovação
        prévia de dois terços dos condôminos. É a mudança regulatória mais relevante do setor neste ciclo.
      </p>
      <p>
        A decisão distingue locação por temporada (finalidade residencial transitória, exige descrição dos móveis no
        contrato) de atividade hoteleira (concierge, lavanderia, alimentação e licença específica) — short stay bem
        operado continua no primeiro grupo, não no segundo. Na prática, isso significa: (1) a convenção do
        condomínio importa mais do que antes — vale revisar antes de anunciar; (2) fatores como frequência de
        ocupação, quantidade de diárias e prestação de serviços acessórios podem pesar na leitura de &ldquo;exploração
        econômica reiterada&rdquo; em caso de disputa; (3) o precedente é recente e ainda vai amadurecer — não existe
        hoje um critério objetivo único aplicável a todo condomínio. Uma gestora que conhece esse risco orienta o
        proprietário antes de operar, não depois de um conflito na assembleia.
      </p>

      <h2>Vale mais a pena administrar o short stay sozinho ou contratar uma gestora?</h2>
      <p>
        Depende do que pesa mais para o proprietário: tempo, padrão de atendimento ao hóspede e proteção do imóvel
        contra o desgaste de uma operação amadora costumam superar o valor da comissão cobrada por uma gestora. Não
        existe resposta genérica — por isso a WeCare avalia cada imóvel, sem compromisso, antes de qualquer contrato.
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
        Veja também <Link href="/blog/locacao-por-temporada">o enquadramento jurídico completo da locação por temporada</Link>{" "}
        e <Link href="/blog/como-escolher-empresa-gestao-airbnb">como escolher uma empresa de administração de Airbnb</Link>.
      </p>
    </>
  );
}

export const post: BlogPost = { meta, Content };
