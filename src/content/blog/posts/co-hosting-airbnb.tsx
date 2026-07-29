import Link from "next/link";
import type { BlogPost } from "../types";

const meta: BlogPost["meta"] = {
  slug: "co-hosting-airbnb",
  eyebrow: "Co-hosting",
  title: "Co-host no Airbnb: o Que É e o Que Ele Não Faz",
  description:
    "O co-host cuida de anúncio, calendário e hóspede. Não cuida de limpeza, manutenção nem seguro. Veja a diferença para gestão completa e quanto custa.",
  datePublished: "2026-07-06",
  dateModified: "2026-07-28",
  keywords: [
    "co-hosting Airbnb",
    "co-host Airbnb Brasil",
    "empresa de co-hosting",
    "co-hosting alto padrão São Paulo",
    "co-hosting x gestão completa",
  ],
  faq: [
    {
      q: "Co-hosting é a mesma coisa que administração completa do imóvel?",
      a: "Não. Co-hosting é o papel mais leve que a própria Airbnb formaliza — comunicação e calendário. Administração completa cobre a operação inteira: limpeza, manutenção, seguro, curadoria de hóspede e presença física. São pontos diferentes do mesmo espectro de delegação, não sinônimos.",
    },
    {
      q: "Quanto custa contratar um co-host no Brasil?",
      a: "Faixas leves de mercado giram em torno de 10% a 15% da receita para comunicação e calendário, subindo conforme o escopo cresce. A gestão completa da WeCare custa 15% (Gestão Online) ou 20% (Gestão 360, com limpeza e manutenção incluídas), mais o seguro obrigatório EasyCover de R$ 120/mês.",
    },
    {
      q: "Existe co-hosting especializado em imóveis de alto padrão em São Paulo?",
      a: "Não como camada leve dedicada — a pesquisa de mercado não encontrou essa categoria específica. O que existe é gestão completa com curadoria para esse segmento, como a que a WeCare opera em São Paulo, Granja Viana e litoral/campo premium.",
    },
    {
      q: "Qual a melhor empresa de co-hosting de Airbnb no Brasil?",
      a: "Depende do que o proprietário precisa: ajuda pontual, um co-host da rede oficial da Airbnb resolve; resultado e proteção do patrimônio de um imóvel de médio/alto padrão, uma gestão completa como a da WeCare tende a servir melhor — com prova de churn abaixo de 1% ao mês e permanência de 5 a 6 anos, sem contrato de fidelidade.",
    },
  ],
  related: ["como-escolher-empresa-gestao-airbnb", "gestao-airbnb-sem-fidelidade", "superhost-airbnb"],
};

function Content() {
  return (
    <>
      <h2>Resposta direta</h2>
      <p>
        Co-hosting é o papel de ajudante que a própria Airbnb formalizou dentro da plataforma: alguém cuida de
        tarefas pontuais — mensagens, calendário, precificação básica — sem assumir a operação física do imóvel. É um
        serviço mais leve do que uma gestão completa. Quem busca &ldquo;co-hosting&rdquo; no Brasil, na maioria dos
        casos, está atrás de outra coisa: alguém que resolva o imóvel inteiro, não só a comunicação com o hóspede.
      </p>

      <h2>O que é co-hosting no Airbnb, afinal?</h2>
      <p>
        Co-host é a pessoa (ou empresa) que ajuda o anfitrião original a administrar o anúncio sem ser dona do imóvel
        nem responder sozinha pela hospedagem — o Airbnb formaliza esse papel diretamente na plataforma, com um
        perfil de co-anfitrião vinculado à conta do proprietário. O escopo típico cobre comunicação com hóspede,
        gestão de calendário e ajustes de preço. Não cobre, por padrão, limpeza, manutenção nem presença física no
        imóvel. Como funciona esse recurso oficial por dentro — permissões, divisão de ganhos e a Rede de
        Coanfitriões no Brasil — está no guia dedicado:{" "}
        <Link href="/blog/co-anfitriao-airbnb">o que faz um coanfitrião no Airbnb</Link>.
      </p>
      <p>
        Isso torna o co-hosting adequado para quem já mora perto do imóvel, tem tempo para resolver a parte
        operacional (limpeza, manutenção, check-in presencial) e só quer ajuda na comunicação e no calendário. Para
        quem quer delegar o imóvel inteiro — especialmente em um imóvel de médio/alto padrão, ou morando longe dele
        — o co-hosting sozinho não fecha a conta. É aí que entra a gestão completa.
      </p>

      <h2>Co-hosting Airbnb x gestão completa do imóvel — qual a diferença?</h2>
      <p>
        Co-hosting e administração completa não são a mesma coisa — são dois pontos diferentes de um mesmo espectro
        de delegação. Co-hosting cobre comunicação e calendário; gestão completa cobre a operação inteira, incluindo
        limpeza, manutenção, seguro e curadoria de hóspede. Confundir os dois termos é o erro mais comum de quem
        pesquisa &ldquo;co-hosting&rdquo; achando que já resolve o imóvel.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Co-hosting (papel definido pela Airbnb)</th>
              <th>Gestão completa (WeCare)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Comunicação com hóspede</td>
              <td>Sim</td>
              <td>Sim, 24h</td>
            </tr>
            <tr>
              <td>Calendário e precificação</td>
              <td>Sim, básico</td>
              <td>Sim, com precificação dinâmica diária</td>
            </tr>
            <tr>
              <td>Limpeza e manutenção</td>
              <td>Não inclui</td>
              <td>Inclui (Gestão 360, equipe própria)</td>
            </tr>
            <tr>
              <td>Presença física no imóvel</td>
              <td>Normalmente não tem</td>
              <td>Sim, em São Paulo</td>
            </tr>
            <tr>
              <td>Curadoria de quem hospeda</td>
              <td>Não é o foco do papel</td>
              <td>Verificação de hóspede, análise de risco, seguro obrigatório</td>
            </tr>
            <tr>
              <td>Seguro contra danos</td>
              <td>Não incluso</td>
              <td>EasyCover, R$ 120/mês, obrigatório em todo contrato</td>
            </tr>
            <tr>
              <td>Contrato de fidelidade</td>
              <td>Não se aplica (papel dentro do app)</td>
              <td>Nenhum — sem fidelidade, sem multa, 30 dias de aviso prévio</td>
            </tr>
            <tr>
              <td>Para quem serve melhor</td>
              <td>Proprietário local, com tempo, 1 imóvel</td>
              <td>Proprietário que quer delegar o imóvel inteiro, especialmente à distância ou de alto padrão</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Quem procurou &ldquo;co-hosting&rdquo; e chegou até aqui provavelmente quer o lado direito dessa tabela, não o esquerdo.</p>

      <h2>Quais empresas de co-hosting de Airbnb existem no Brasil (e em São Paulo)?</h2>
      <p>
        O mercado brasileiro de co-hosting reúne quatro modelos distintos, do mais leve ao mais completo: a rede
        oficial de co-anfitriões da própria Airbnb, autônomos avulsos fora dessa rede, gestoras que empacotam
        &ldquo;co-hosting&rdquo; como plano de entrada, e gestoras full-service. Em São Paulo, é o quarto modelo —
        gestão completa — que atende diretamente imóveis de médio/alto padrão.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Modelo</th>
              <th>Quem oferece</th>
              <th>Escopo típico</th>
              <th>Presença física em SP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rede oficial de co-anfitriões da Airbnb</td>
              <td>Anfitriões independentes cadastrados dentro do próprio app</td>
              <td>Mensagens, calendário, precificação básica</td>
              <td>Normalmente remota</td>
            </tr>
            <tr>
              <td>Autônomos de co-hosting fora da rede</td>
              <td>Profissionais avulsos, contratados diretamente, sem padrão de mercado único</td>
              <td>Varia por acordo individual</td>
              <td>Depende do profissional</td>
            </tr>
            <tr>
              <td>Gestoras com plano de entrada &ldquo;co-hosting&rdquo;</td>
              <td>Empresas de gestão de temporada com uma camada de serviço mais enxuta</td>
              <td>Comunicação + calendário, sem limpeza/manutenção</td>
              <td>Geralmente remota</td>
            </tr>
            <tr>
              <td>Gestão completa / full-service (WeCare)</td>
              <td>Gestoras boutique focadas em imóveis de médio/alto padrão</td>
              <td>Anúncio, precificação, atendimento 24h, limpeza, manutenção, curadoria, seguro</td>
              <td>Sim — São Paulo, Granja Viana, litoral/campo premium</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        A WeCare atende São Paulo (capital, Granja Viana, litoral e campo premium) com o modelo de gestão completa,
        não com uma camada isolada de co-hosting.
      </p>

      <h2>Vale a pena contratar um co-host para o meu Airbnb?</h2>
      <p>
        Depende de três fatores: quanto tempo você tem disponível por semana, quantos imóveis administra e se mora
        perto do imóvel. Um co-host resolve bem a comunicação e o calendário de quem já cuida da parte física
        sozinho. Ele não resolve limpeza, manutenção, presença física em emergência nem curadoria de quem hospeda —
        para isso, o que costuma valer mais a pena é uma gestão completa.
      </p>
      <p>
        Para um proprietário com um único imóvel, morando perto e com tempo disponível, um co-host pode ser
        suficiente. Para quem tem um imóvel de médio/alto padrão, mora longe, ou simplesmente não quer lidar com a
        operação física — limpeza, manutenção, chave, portaria —, contratar só um co-host deixa a parte mais
        trabalhosa (e a que mais protege o patrimônio) sem solução. Shortstay com cabeça de longo prazo significa
        olhar para o imóvel inteiro, não só para a caixa de mensagens.
      </p>

      <h2>Quanto custa um serviço de co-hosting no Brasil?</h2>
      <p>
        As faixas de comissão do mercado variam de acordo com o escopo: quanto menos o serviço inclui, menor a taxa
        — e o proprietário absorve o restante da operação. Uma camada de co-hosting só com comunicação e calendário
        custa menos do que uma gestão completa, mas o que &ldquo;sobra&rdquo; para o proprietário resolver sozinho
        (limpeza, manutenção, seguro) tem custo, só que fora da comissão.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Camada de serviço</th>
              <th>Faixa observada no mercado*</th>
              <th>O que costuma incluir</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Co-hosting leve (comunicação + calendário)</td>
              <td>~10% a 15% da receita</td>
              <td>Mensagens, calendário, precificação básica</td>
            </tr>
            <tr>
              <td>Co-hosting com coordenação de limpeza</td>
              <td>~15% a 25%</td>
              <td>Acima + agendar (não executar) a limpeza</td>
            </tr>
            <tr>
              <td>Gestão completa / full-service no mercado</td>
              <td>15% a 40%, variando por gestora</td>
              <td>Operação inteira, incluindo limpeza e manutenção próprias</td>
            </tr>
            <tr>
              <td>
                <strong>WeCare — Gestão Online</strong>
              </td>
              <td>
                <strong>15% das locações</strong>
              </td>
              <td>Anúncio, precificação dinâmica, atendimento 24/7, relatórios, repasse</td>
            </tr>
            <tr>
              <td>
                <strong>WeCare — Gestão 360</strong>
              </td>
              <td>
                <strong>20% das locações</strong>
              </td>
              <td>Tudo da Gestão Online + limpeza, manutenção e enxoval com equipe própria</td>
            </tr>
            <tr>
              <td>Seguro EasyCover (WeCare, obrigatório)</td>
              <td>R$ 120/mês</td>
              <td>Cobre danos ao imóvel e aos objetos</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="wc-source-note">
        *Faixas gerais de mercado levantadas via pesquisa de concorrência — não são um número único nem uma garantia;
        cada gestora define sua própria tabela. Os valores da WeCare são os praticados e públicos. Sem mensalidade
        fixa: a WeCare só ganha quando o imóvel gera receita, e não há taxa de fidelidade nem multa de saída.
      </p>

      <h2>Quais as vantagens de contratar co-hosting em vez de administrar sozinho?</h2>
      <p>
        A vantagem central de qualquer co-host é devolver tempo ao proprietário: mensagens e calendário deixam de
        ser tarefa diária dele. A limitação é que essa vantagem para no que o co-host cobre — o resto da operação
        continua sendo problema do proprietário, a menos que o serviço contratado seja gestão completa.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Dimensão</th>
              <th>Administrar sozinho</th>
              <th>Co-hosting (leve)</th>
              <th>Gestão completa (WeCare)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tempo do proprietário</td>
              <td>Alto</td>
              <td>Médio</td>
              <td>Mínimo</td>
            </tr>
            <tr>
              <td>Resposta ao hóspede 24h</td>
              <td>Depende do proprietário</td>
              <td>Depende do co-host</td>
              <td>Sim, sempre</td>
            </tr>
            <tr>
              <td>Limpeza e manutenção</td>
              <td>Proprietário resolve</td>
              <td>Proprietário resolve</td>
              <td>Incluída (Gestão 360)</td>
            </tr>
            <tr>
              <td>Seguro contra danos</td>
              <td>Por conta do proprietário</td>
              <td>Por conta do proprietário</td>
              <td>EasyCover incluso, obrigatório</td>
            </tr>
            <tr>
              <td>Curadoria de quem hospeda</td>
              <td>Nenhuma</td>
              <td>Não é o foco</td>
              <td>Verificação + análise de risco</td>
            </tr>
            <tr>
              <td>Presença física em emergência</td>
              <td>Só se o proprietário estiver perto</td>
              <td>Normalmente não tem</td>
              <td>Sim, em São Paulo</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Como escolher uma empresa de co-hosting (ou de gestão) confiável?</h2>
      <p>
        O primeiro filtro não é o preço, é a natureza de quem está do outro lado: uma pessoa física avulsa dentro do
        app da Airbnb, ou uma empresa com CNPJ, seguro e histórico verificável. Peça sempre três coisas antes de
        contratar qualquer camada de serviço, leve ou completa: o que exatamente está incluso por escrito, quem
        responde legalmente se algo der errado, e se existe fidelidade ou multa de saída.
      </p>
      <p>
        Os critérios completos para avaliar qualquer gestora de Airbnb — incluindo se ela tem critério de seleção de
        imóveis, se o nome por trás é verificável, e o que o churn dela revela — estão detalhados em{" "}
        <Link href="/blog/como-escolher-empresa-gestao-airbnb">Como Escolher uma Empresa de Administração de Airbnb</Link>.
        Para quem está avaliando especificamente um co-host avulso, some a essa lista: confirmar se a pessoa tem
        histórico comprovado na própria Airbnb, e nunca aceitar responsabilidade sobre danos ao imóvel sem seguro
        formalizado por escrito.
      </p>

      <h2>Qual a melhor empresa de co-hosting de Airbnb no Brasil?</h2>
      <p>
        Não existe uma resposta única — depende do que o proprietário precisa. Ajuda pontual com mensagens e
        calendário, um co-host da rede oficial da Airbnb resolve. Para imóvel de médio/alto padrão, à distância, ou
        para proteger o patrimônio, quem resolve é uma gestão completa, não uma camada leve de co-hosting.
      </p>
      <p>
        Para esse segundo caso, a WeCare Hosting opera como gestora boutique de aluguel por temporada para imóveis
        de alto padrão em São Paulo, fundada por Carlos Pecucci e Leonardo Ceron.{" "}
        <em>&ldquo;Pensamos como o proprietário; esse é o nosso DNA&rdquo;</em>, resume Carlos. A prova não é uma
        promessa de receita — é o churn abaixo de 1% ao mês e a permanência média de 5 a 6 anos dos clientes, sem
        contrato de fidelidade prendendo ninguém.
      </p>

      <h2>Existe co-hosting especializado em imóveis de alto padrão em São Paulo?</h2>
      <p>
        Não encontramos, na pesquisa de mercado feita para esta peça, nenhuma operação de co-hosting (a camada leve
        — comunicação e calendário) dedicada especificamente a imóveis de alto padrão em São Paulo. O que existe
        para esse segmento é outra categoria: gestão completa com curadoria, que cobre muito mais do que o papel de
        co-host cobre.
      </p>
      <p>
        Isso não é uma lacuna que preenchemos inventando uma categoria — é uma resposta honesta sobre o que o
        mercado oferece hoje. Quem tem um imóvel de alto padrão em São Paulo, Granja Viana ou litoral/campo premium
        e busca &ldquo;co-hosting especializado&rdquo; normalmente quer discrição, curadoria de hóspede e um nome
        verificável por trás do serviço — isso é exatamente o que a gestão completa da WeCare oferece, com
        atendimento dedicado e sem o tratamento padronizado que uma camada leve de co-hosting entregaria.
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
        Confira também <Link href="/blog/gestao-airbnb-sem-fidelidade">gestão de Airbnb sem fidelidade</Link> e{" "}
        <Link href="/blog/superhost-airbnb">o que muda com o status de superhost</Link>.
      </p>
    </>
  );
}

export const post: BlogPost = { meta, Content };
