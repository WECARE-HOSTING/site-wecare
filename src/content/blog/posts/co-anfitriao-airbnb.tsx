import Link from "next/link";
import type { BlogPost } from "../types";

const meta: BlogPost["meta"] = {
  slug: "co-anfitriao-airbnb",
  eyebrow: "Coanfitrião",
  title: "Coanfitrião no Airbnb: o Que Faz, Quanto Custa e Como Escolher (Guia 2026)",
  description:
    "Coanfitrião é o papel oficial do Airbnb: permissões, divisão de ganhos e a Rede de Coanfitriões no Brasil. Veja o que ele pode fazer e como contratar com segurança.",
  datePublished: "2026-07-08",
  dateModified: "2026-07-08",
  keywords: [
    "co-anfitrião Airbnb",
    "coanfitrião Airbnb",
    "o que faz um co-anfitrião",
    "quanto custa co-anfitrião",
    "Rede de Coanfitriões Brasil",
    "permissões coanfitrião",
  ],
  faq: [
    {
      q: "O que faz um coanfitrião no Airbnb?",
      a: "Ajuda o dono do anúncio a operar a hospedagem: mensagens com hóspedes, calendário, preços e, conforme o nível de permissão, gestão de reservas e do anúncio inteiro. É um papel oficial da plataforma — cada anúncio aceita até 10 coanfitriões, e o dono define o que cada um acessa.",
    },
    {
      q: "Quanto custa contratar um coanfitrião?",
      a: "Não há tabela oficial — o valor é combinado entre as partes e pago pela plataforma via “cotas do coanfitrião” (porcentagem, valor fixo ou taxa de limpeza). Autônomos leves giram em torno de 10% a 15% da receita; gestão completa é outra categoria — na WeCare, 15% ou 20% das locações.",
    },
    {
      q: "Coanfitrião é a mesma coisa que gestão completa?",
      a: "Não. Coanfitrião é um perfil autorizado dentro do app, sem contrato nem seguro incluso — a responsabilidade perante o Airbnb continua do dono do anúncio. Gestão completa é contrato com empresa, com equipe própria, seguro e resposta formal pela operação inteira.",
    },
    {
      q: "Existe uma rede oficial de coanfitriões no Brasil?",
      a: "Sim. A Rede de Coanfitriões do Airbnb está disponível no Brasil (operada pela Airbnb Plataforma Digital Ltda) e reúne coanfitriões locais qualificados pela plataforma — com avaliações altas e experiência comprovada — para serviços que vão de configuração do anúncio a limpeza e assistência presencial ao hóspede.",
    },
  ],
  related: ["co-hosting-airbnb", "como-escolher-empresa-gestao-airbnb", "anfitriao-profissional-airbnb"],
};

function Content() {
  return (
    <>
      <h2>Resposta direta</h2>
      <p>
        Coanfitrião (a grafia oficial do Airbnb; também escrito co-anfitrião) é a pessoa que o dono de um anúncio
        autoriza, dentro da própria plataforma, a ajudar na administração — mensagens, calendário, preços ou a gestão
        toda do anúncio. É um recurso oficial, com níveis de permissão e divisão de ganhos paga pelo próprio Airbnb.
        Este guia consolida as regras e mostra como contratar sem risco.
      </p>

      <h2>O que faz um co-anfitrião no Airbnb?</h2>
      <p>
        Um coanfitrião ajuda o dono do anúncio a operar a hospedagem sem ser dono do imóvel: troca mensagens com
        hóspedes, mantém calendário e preços, gerencia reservas e, conforme o combinado, cuida de limpeza e recepção.
        O Airbnb formaliza o papel na plataforma — cada anúncio aceita até 10 coanfitriões, com permissões definidas
        pelo dono.
      </p>
      <p>
        Na prática, coanfitriões costumam ser um familiar, um vizinho de confiança ou um profissional contratado. O
        ponto que a Central de Ajuda do Airbnb faz questão de frisar: as permissões só definem o que a pessoa{" "}
        <strong>acessa</strong> no anúncio — o que ela <strong>faz</strong> no mundo físico (limpeza, manutenção,
        check-in presencial) continua sendo um acordo particular entre vocês, que a plataforma não gerencia nem
        fiscaliza.
      </p>

      <h2>Quais permissões um coanfitrião pode ter?</h2>
      <p>
        O Airbnb oferece três níveis de permissão, escolhidos pelo dono do anúncio ao convidar o coanfitrião e
        alteráveis a qualquer momento. A regra de ouro: o dono do anúncio permanece responsável pelos seus
        coanfitriões — inclusive os de acesso completo. Permissão é delegação de acesso, não de responsabilidade.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>O que o coanfitrião pode fazer</th>
              <th>Acesso total</th>
              <th>Calendário + mensagens</th>
              <th>Só calendário</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ver o calendário (check-ins e check-outs)</td>
              <td>✓</td>
              <td>✓</td>
              <td>✓</td>
            </tr>
            <tr>
              <td>Trocar mensagens com hóspedes</td>
              <td>✓</td>
              <td>✓</td>
              <td>✗</td>
            </tr>
            <tr>
              <td>Editar calendário, preços e informações do anúncio</td>
              <td>✓</td>
              <td>✗</td>
              <td>✗</td>
            </tr>
            <tr>
              <td>Aceitar/recusar reservas e alterações de viagem</td>
              <td>✓</td>
              <td>✗</td>
              <td>✗</td>
            </tr>
            <tr>
              <td>Acionar a Central de Resoluções por danos</td>
              <td>✓</td>
              <td>✗</td>
              <td>✗</td>
            </tr>
            <tr>
              <td>Ver o painel de ganhos do anúncio</td>
              <td>✓</td>
              <td>✗</td>
              <td>✗</td>
            </tr>
            <tr>
              <td>Avaliar hóspedes</td>
              <td>✓</td>
              <td>✗</td>
              <td>✗</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        O que <strong>nenhum</strong> coanfitrião pode fazer, em nenhum nível: ver ou alterar os dados de pagamento e
        de contribuinte do dono, definir a própria cota de ganhos, ou designar a si mesmo como anfitrião principal do
        anúncio. Essas travas são o que mantém o controle financeiro com o proprietário.
      </p>

      <h2>Quanto custa contratar um co-anfitrião profissional?</h2>
      <p>
        O Airbnb não tabela o preço: o valor é livremente combinado entre dono e coanfitrião. O que a plataforma
        oferece é o mecanismo de pagamento — as &ldquo;cotas do coanfitrião&rdquo;, configuradas só pelo dono do
        anúncio e pagas direto pelo Airbnb após o check-in de cada reserva, em quatro formatos:
      </p>
      <ul>
        <li>
          <strong>Porcentagem por reserva</strong> (incluindo ou excluindo a taxa de limpeza) — o formato mais comum;
        </li>
        <li>
          <strong>Valor fixo por reserva</strong>;
        </li>
        <li>
          <strong>Taxa de limpeza</strong> repassada integralmente;
        </li>
        <li>
          <strong>Taxa de limpeza + porcentagem</strong>.
        </li>
      </ul>
      <p>
        Como referência de mercado: coanfitriões autônomos que cobrem só comunicação e calendário giram em torno de
        10% a 15% da receita (síntese de pesquisa de concorrência — cada profissional define o próprio preço). Uma
        gestão completa profissional é outra categoria de serviço e de preço: a WeCare Hosting, gestora de aluguel por
        temporada, cobra 15% (Gestão Online) ou 20% (Gestão 360) das locações — a comparação detalhada de camadas está
        no nosso guia de <Link href="/blog/co-hosting-airbnb">co-hosting x gestão completa</Link>.
      </p>
      <p>
        Detalhe fiscal relevante: segundo a Central de Ajuda, o dono do anúncio recebe documento fiscal pelo valor
        total da reserva, e o coanfitrião recebe documento próprio pela parte dele — formalizar a cota dentro da
        plataforma deixa rastro e documentação para os dois lados.
      </p>

      <h2>Vale a pena ter um coanfitrião em vez de administrar o imóvel sozinho?</h2>
      <p>
        Vale quando o gargalo é o seu tempo e a distância é administrável: um coanfitrião devolve as horas gastas com
        mensagens, calendário e coordenação — o motivo mais comum de burnout de anfitrião com um imóvel só. Não
        resolve, porém, o que exige estrutura: equipe de limpeza própria, manutenção, seguro e resposta presencial a
        emergência.
      </p>
      <p>O teste prático em quatro perguntas:</p>
      <ol>
        <li>
          <strong>Seu problema é tempo ou operação?</strong> Só tempo (mensagens, calendário): um coanfitrião
          resolve. Operação física inteira: você precisa de mais que um coanfitrião.
        </li>
        <li>
          <strong>Quem responde a uma emergência às 2h da manhã</strong> — e a quantos minutos do imóvel essa pessoa
          está?
        </li>
        <li>
          <strong>Você continua enxergando tudo?</strong> Delegar não pode significar ficar no escuro sobre o próprio
          ativo. Quem cuida do seu imóvel precisa te mostrar faturamento, reservas e repasses — sem que você precise
          pedir. Um acordo informal raramente sustenta isso por muito tempo.
        </li>
        <li>
          <strong>Quem assume o risco?</strong> O dono do anúncio segue responsável perante o Airbnb pelos atos dos
          seus coanfitriões. Um profissional avulso não muda isso; uma empresa com CNPJ, contrato e seguro, sim.
        </li>
      </ol>
      <p>
        Para um imóvel de médio/alto padrão — onde um erro de hóspede ou de manutenção custa caro —, a conta costuma
        apontar para a gestão completa, não para a camada leve.
      </p>

      <h2>Quais empresas (e pessoas) oferecem serviço de co-anfitrião no Brasil?</h2>
      <p>
        Há três caminhos para encontrar um coanfitrião no Brasil, do mais leve ao mais estruturado: a Rede de
        Coanfitriões oficial do Airbnb, profissionais autônomos fora da rede e empresas de gestão profissional. O que
        muda entre eles é o vínculo — perfil dentro do app, acordo informal ou contrato com empresa.
      </p>
      <p>
        <strong>A Rede de Coanfitriões oficial está disponível no Brasil</strong> (operada pela Airbnb Plataforma
        Digital Ltda) — um fato que a maioria dos anfitriões brasileiros desconhece. Nela, o dono de anúncio encontra
        coanfitriões locais qualificados pela própria plataforma — perfis com avaliações altas, baixa taxa de
        cancelamento e experiência comprovada — oferecendo serviços avulsos ou suporte completo: configuração de
        anúncio, mensagens, preço e disponibilidade, pedidos de reserva, assistência presencial ao hóspede e limpeza.
        São profissionais individuais: a qualificação é da plataforma, mas não há empresa, SLA nem seguro por trás.
      </p>
      <p>
        Autônomos fora da rede funcionam por indicação e acordo direto — sem qualquer camada de verificação. Empresas
        de gestão, por fim, assumem a operação com estrutura própria; nesse grupo, a WeCare Hosting atende
        especificamente imóveis de médio/alto padrão em São Paulo, Granja Viana e litoral/campo premium, com gestão
        completa — não como coanfitriã avulsa.
      </p>

      <h2>Coanfitrião é a mesma coisa que gestão completa do imóvel?</h2>
      <p>
        Não — e a diferença mais importante não é a lista de tarefas, é o vínculo. Coanfitrião é um{" "}
        <strong>perfil autorizado dentro do aplicativo</strong>, sem contrato de serviço, sem CNPJ obrigatório e sem
        seguro; gestão completa é um <strong>contrato com uma empresa</strong> que assume a operação inteira e
        responde formalmente por ela.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Coanfitrião (recurso do Airbnb)</th>
              <th>Gestão completa (empresa)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vínculo</td>
              <td>Convite e permissões dentro do app</td>
              <td>Contrato de prestação de serviço</td>
            </tr>
            <tr>
              <td>Quem responde se algo der errado</td>
              <td>O dono do anúncio, perante o Airbnb</td>
              <td>A empresa, nos termos do contrato</td>
            </tr>
            <tr>
              <td>Seguro contra danos</td>
              <td>Não incluso</td>
              <td>Na WeCare: EasyCover obrigatório em toda locação</td>
            </tr>
            <tr>
              <td>Estrutura (limpeza, manutenção, 24h)</td>
              <td>Depende da pessoa</td>
              <td>Equipe própria</td>
            </tr>
            <tr>
              <td>Formalização do pagamento</td>
              <td>Cota paga pela plataforma</td>
              <td>Repasse com relatório mensal</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        O escopo detalhado de cada camada de serviço — e as faixas de preço do mercado — estão no guia dedicado:{" "}
        <Link href="/blog/co-hosting-airbnb">Co-hosting no Airbnb: a diferença para gestão completa</Link>.
      </p>

      <h2>Como escolher um coanfitrião confiável para meu Airbnb?</h2>
      <p>
        Confiabilidade, aqui, se constrói com as travas que a própria plataforma oferece — use todas antes de confiar
        em qualquer pessoa. O checklist de contratação segura:
      </p>
      <ol>
        <li>
          <strong>Comece pela permissão mínima.</strong> Calendário + mensagens resolve a maioria dos casos; acesso
          total só depois de meses de histórico — lembrando que quem tem acesso total enxerga todos os seus ganhos.
        </li>
        <li>
          <strong>Só convide quem concluiu a verificação de identidade</strong> do Airbnb (a plataforma exige antes de
          o convite ser aceito).
        </li>
        <li>
          <strong>Exija histórico verificável na plataforma:</strong> avaliações como anfitrião ou coanfitrião. A Rede
          de Coanfitriões já faz essa triagem; fora dela, a triagem é sua.
        </li>
        <li>
          <strong>Formalize a cota dentro da plataforma</strong>, nunca por fora — o pagamento vira rastreável,
          documentado fiscalmente e cancelável a qualquer momento.
        </li>
        <li>
          <strong>Escreva quem faz o quê.</strong> As permissões definem acesso, não responsabilidade física —
          limpeza, check-in presencial e emergências precisam estar combinados por escrito.
        </li>
        <li>
          <strong>Combine antecipadamente quem aciona danos:</strong> só coanfitrião com acesso total abre pedido na
          Central de Resoluções — numa emergência, isso não pode estar indefinido.
        </li>
      </ol>
      <p>
        Se o que você procura não é uma pessoa para dividir tarefas, mas alguém que assuma o imóvel inteiro — com
        estrutura, responsabilidade contratual e transparência total sobre o que acontece com o seu patrimônio —, o
        caminho é outro:{" "}
        <Link href="/blog/como-escolher-empresa-gestao-airbnb">avalie uma gestão completa</Link>.
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
