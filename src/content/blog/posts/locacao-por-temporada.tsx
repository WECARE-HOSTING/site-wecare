import Link from "next/link";
import type { BlogPost } from "../types";

const meta: BlogPost["meta"] = {
  slug: "locacao-por-temporada",
  eyebrow: "Lei e tributação",
  title: "Locação por Temporada: Lei, Tributação e Documentos (Guia 2026)",
  description:
    "O que diz a Lei do Inquilinato (arts. 48-50), como funciona a tributação após a reforma tributária e o que mudou com a decisão do STJ de maio/2026 sobre aprovação em condomínio.",
  datePublished: "2026-07-06",
  dateModified: "2026-07-06",
  keywords: [
    "locação por temporada",
    "locação para temporada Lei do Inquilinato",
    "tributação locação por temporada",
    "documentos locação por temporada",
    "riscos jurídicos locação por temporada",
    "aprovação condomínio locação por temporada",
  ],
  faq: [
    {
      q: "A locação por temporada é a mesma coisa que aluguel comum?",
      a: "Não. É uma categoria própria da Lei do Inquilinato (arts. 48-50), com prazo máximo de 90 dias e regras específicas — pagamento antecipado, garantia facultativa e, se mobiliado, descrição obrigatória dos móveis no contrato. Aluguel residencial comum não tem esse limite de prazo.",
    },
    {
      q: "Preciso de autorização do condomínio para fazer locação por temporada?",
      a: "Cada vez mais, sim, na prática. Desde 07/05/2026, o STJ decidiu (REsp 2.121.055/MG) que a exploração econômica reiterada via plataforma digital pode exigir aprovação de 2/3 dos condôminos, mesmo sem previsão expressa na convenção proibindo a atividade.",
    },
    {
      q: "Vou pagar mais imposto por causa da reforma tributária?",
      a: "Só se você tiver mais de 3 imóveis alugados e faturar mais de R$ 240 mil por ano com essa atividade. Abaixo desses dois limites, a tributação continua sendo só o Imposto de Renda via carnê-leão, como hoje — a regra do IBS/CBS (LC 214/2025 e LC 227/2026) tem transição até 2033 e não é retroativa nem imediata.",
    },
    {
      q: "O imóvel precisa ser mobiliado para ser locação por temporada?",
      a: "Não. A lei (art. 48, Lei 8.245/91) diz expressamente \"esteja ou não mobiliado o imóvel\". Mobília é prática de mercado para atrair hóspede, não requisito legal do enquadramento — mas, se houver mobília, o contrato precisa descrevê-la.",
    },
  ],
  related: ["short-stay-airbnb", "quanto-rende-apartamento-airbnb-sao-paulo", "como-escolher-empresa-gestao-airbnb"],
};

function Content() {
  return (
    <>
      <h2>Resposta direta</h2>
      <p>
        Locação por temporada é uma categoria jurídica própria, prevista nos artigos 48 a 50 da Lei do Inquilinato
        (Lei 8.245/91) — contrato de até 90 dias, residencial, mobiliado ou não. A renda é tributada como aluguel
        comum (carnê-leão mensal, tabela progressiva do IR); só passa a sofrer IBS/CBS da reforma tributária quem
        tem mais de 3 imóveis alugados e fatura mais de R$ 240 mil por ano. Desde maio de 2026, o STJ exige
        aprovação de 2/3 dos condôminos quando a operação por plataforma digital descaracteriza a destinação
        residencial do prédio.
      </p>

      <h2>Como funciona a locação por temporada de um imóvel?</h2>
      <p>
        Locação por temporada é a modalidade prevista no art. 48 da Lei 8.245/91: contrato de residência transitória
        — lazer, curso, tratamento de saúde, obra no próprio imóvel do locatário ou motivo semelhante — por prazo
        não superior a 90 dias, mobiliado ou não. O locador pode cobrar os aluguéis antecipadamente e exigir
        garantia (art. 49). É essa base legal, e não uma lei específica de &ldquo;Airbnb&rdquo; ou &ldquo;short
        stay&rdquo;, que rege qualquer plataforma de reserva no Brasil.
      </p>
      <p>Três pontos da lei costumam passar despercebidos em conteúdo de mercado:</p>
      <p>
        <strong>O imóvel não precisa ser mobiliado.</strong> O texto do art. 48 é explícito: &ldquo;esteja ou não
        mobiliado o imóvel&rdquo;. Mobília é a regra prática do mercado (hóspede busca imóvel pronto para uso), não
        uma exigência legal para o enquadramento como locação por temporada.
      </p>
      <p>
        <strong>Se mobiliado, o contrato precisa descrever os móveis.</strong> O parágrafo único do art. 48 obriga
        constar no contrato a descrição dos móveis e utensílios e o estado em que se encontram — não é uma boa
        prática opcional, é requisito legal.
      </p>
      <p>
        <strong>A locação pode virar contrato por prazo indeterminado sem querer.</strong> Pelo art. 50, se o
        hóspede permanecer no imóvel por mais de 30 dias após o fim do prazo ajustado, sem oposição do locador, a
        lei presume a locação prorrogada por prazo indeterminado — e o locador só pode denunciar o contrato depois
        de 30 meses do início, ou nas hipóteses do art. 47. Isso transforma um problema operacional simples (hóspede
        não sai na data) em um problema jurídico sério, se não houver oposição formal e registrada dentro da janela
        de 30 dias.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Elemento legal</th>
              <th>O que diz a Lei 8.245/91</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Prazo máximo</td>
              <td>90 dias (art. 48)</td>
            </tr>
            <tr>
              <td>Mobília</td>
              <td>Opcional — &ldquo;esteja ou não mobiliado o imóvel&rdquo; (art. 48)</td>
            </tr>
            <tr>
              <td>Descrição de móveis no contrato</td>
              <td>Obrigatória se houver mobília (art. 48, parágrafo único)</td>
            </tr>
            <tr>
              <td>Pagamento antecipado</td>
              <td>Permitido, de uma só vez (art. 49)</td>
            </tr>
            <tr>
              <td>Garantia</td>
              <td>Pode ser exigida qualquer modalidade prevista no art. 37 (caução, fiança, seguro-fiança, cessão fiduciária)</td>
            </tr>
            <tr>
              <td>Risco de virar prazo indeterminado</td>
              <td>Sim, se o locatário ficar mais de 30 dias além do prazo sem oposição do locador (art. 50)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Quais empresas administram locação por temporada em São Paulo?</h2>
      <p>
        O mercado reúne dois modelos: gestoras de escala, que priorizam volume de imóveis, e gestoras boutique, que
        avaliam e limitam quantos imóveis aceitam para manter padrão por unidade. A WeCare opera no segundo grupo,
        com foco em imóveis de médio/alto padrão em São Paulo.
      </p>
      <p>
        Não existe ranking objetivo e verificável de &ldquo;melhores empresas&rdquo; publicado por elas mesmas —
        isso é autopromoção, não avaliação independente. Os critérios que efetivamente separam uma gestora séria de
        uma que só cadastra imóveis (critério de seleção, transparência de taxa, ausência de fidelidade, churn
        comprovável, autoridade verificável) já estão detalhados em{" "}
        <Link href="/blog/como-escolher-empresa-gestao-airbnb">Como Escolher uma Empresa de Administração de Airbnb</Link>{" "}
        — vale a leitura completa antes de assinar qualquer contrato de gestão.
      </p>

      <h2>Vale a pena colocar meu imóvel para locação por temporada?</h2>
      <p>
        Depende do imóvel, da localização e da qualidade da gestão — não existe resposta genérica. O dado de mercado
        (receita, ocupação, diária em São Paulo) e a análise completa de &ldquo;vale a pena&rdquo; já estão em{" "}
        <Link href="/blog/short-stay-airbnb">Short Stay: o Que É, Como Funciona e Vale a Pena em 2026</Link>, que
        trata short stay como sinônimo operacional de locação por temporada.
      </p>
      <p>
        O ângulo jurídico muda uma parte da conta: antes de decidir, é preciso somar o custo de compliance —
        verificar a convenção do condomínio (ver seção sobre riscos jurídicos), organizar a documentação exigida
        pela Lei do Inquilinato (ver seção de documentos) e entender a tributação real, não a que circula como boato
        (ver seção de tributação). Esse custo é baixo para quem faz certo desde o início, mas alto para quem só
        descobre o problema depois de uma notificação do síndico ou da Receita Federal.
      </p>

      <h2>Quanto rende a locação por temporada de um apartamento em São Paulo?</h2>
      <p>
        O dado de mercado (receita média, diária, ocupação) está em{" "}
        <Link href="/blog/quanto-rende-apartamento-airbnb-sao-paulo">
          Quanto Rende um Apartamento no Airbnb em São Paulo
        </Link>{" "}
        — não repetimos o número aqui para não duplicar a mesma fonte (Airbtics) em duas peças.
      </p>
      <p>
        O recorte jurídico específico de apartamento: a convenção do condomínio pode restringir a atividade, e a
        decisão do STJ de maio de 2026 (ver seção sobre riscos jurídicos, abaixo) torna a aprovação em assembleia um
        fator real de viabilidade, não só um detalhe contratual — verificar isso antes de calcular qualquer retorno
        esperado.
      </p>

      <h2>Quais os riscos jurídicos da locação por temporada?</h2>
      <p>
        O risco jurídico mais relevante hoje é condominial: desde 07/05/2026, o STJ exige aprovação de 2/3 dos
        condôminos quando a locação por temporada, por sua reiteração, descaracteriza a destinação residencial do
        prédio (REsp 2.121.055/MG). Outros dois riscos menos discutidos: o contrato sem descrição de móveis (nulo
        nesse ponto específico, art. 48, parágrafo único) e a conversão indesejada para prazo indeterminado se o
        locador não formalizar oposição em até 30 dias após o fim do contrato (art. 50).
      </p>
      <p>
        <strong>O que a decisão do STJ efetivamente disse</strong> (fonte primária: stj.jus.br, notícia de
        07/05/2026): a Segunda Seção decidiu, por maioria de votos, que a utilização de imóveis em condomínio para
        locação por temporada — inclusive via plataforma digital como o Airbnb — &ldquo;exige que a destinação das
        unidades tenha sido alterada em assembleia, por no mínimo dois terços dos condôminos&rdquo;, quando o uso
        caracteriza exploração econômica ou profissional. A relatora, ministra Nancy Andrighi, fundamentou o voto
        nos arts. 1.336, IV, e 1.351 do Código Civil (dever de respeitar a destinação do condomínio; exigência de
        2/3 para mudar essa destinação). O STJ negou o recurso da proprietária e manteve a decisão do TJMG que já
        vedava a locação sem essa aprovação. O processo tramitou desde 2023 (2023/0353644-9); a votação foi por
        maioria de 5 votos a 4.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Risco jurídico</th>
              <th>Base legal/precedente</th>
              <th>Como mitigar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Falta de aprovação condominial (2/3)</td>
              <td>REsp 2.121.055/MG, STJ, 07/05/2026 — arts. 1.336, IV e 1.351, Código Civil</td>
              <td>Verificar a convenção e, se necessário, levar o tema à assembleia antes de anunciar</td>
            </tr>
            <tr>
              <td>Contrato sem descrição de móveis</td>
              <td>Art. 48, parágrafo único, Lei 8.245/91</td>
              <td>Descrever móveis e utensílios e seu estado em todo contrato de imóvel mobiliado</td>
            </tr>
            <tr>
              <td>Conversão para prazo indeterminado</td>
              <td>Art. 50, Lei 8.245/91</td>
              <td>Formalizar oposição por escrito se o hóspede ultrapassar o prazo contratado</td>
            </tr>
            <tr>
              <td>Ausência de garantia formal</td>
              <td>Art. 37 e 49, Lei 8.245/91</td>
              <td>Exigir caução, fiança, seguro-fiança ou cessão fiduciária, conforme o caso</td>
            </tr>
            <tr>
              <td>Enquadramento tributário incorreto</td>
              <td>Ver seção de tributação, abaixo</td>
              <td>Apurar carnê-leão mensal; avaliar exposição a IBS/CBS apenas se o proprietário tiver mais de 3 imóveis e faturamento acima de R$ 240 mil/ano</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Locação por temporada precisa de contrato de fidelidade?</h2>
      <p>
        Não é uma exigência legal — fidelidade é uma cláusula de contrato <em>entre proprietário e gestora</em>, não
        algo previsto na Lei do Inquilinato para locação por temporada. Esse tema já está respondido em detalhe em{" "}
        <Link href="/blog/gestao-airbnb-sem-fidelidade">Gestão de Airbnb sem fidelidade</Link>: a WeCare não usa
        fidelidade nem multa em nenhum dos planos de gestão.
      </p>

      <h2>Qual a melhor empresa de locação por temporada no Brasil?</h2>
      <p>
        Não existe ranking nacional objetivo e verificável — qualquer lista publicada por uma gestora sobre si
        mesma é autopromoção. O critério correto não é &ldquo;quem é a melhor&rdquo; de forma abstrata, mas quais
        perguntas fazer antes de contratar: critério de seleção do imóvel, transparência total de taxa, ausência de
        fidelidade, churn comprovável e autoridade verificável — os cinco critérios detalhados, com tabela
        comparativa, em{" "}
        <Link href="/blog/como-escolher-empresa-gestao-airbnb">Como Escolher uma Empresa de Administração de Airbnb</Link>.
      </p>

      <h2>Como funciona a tributação da locação por temporada?</h2>
      <p>
        Para a grande maioria dos proprietários, a tributação da locação por temporada é a mesma do aluguel comum:
        Imposto de Renda via carnê-leão mensal, na tabela progressiva. A reforma tributária (IBS/CBS) só passa a
        incidir sobre quem tem mais de 3 imóveis alugados e fatura mais de R$ 240 mil por ano com essa atividade —
        um universo pequeno, apesar da confusão generalizada em torno do tema.
      </p>
      <p>
        <strong>Regra geral (Imposto de Renda):</strong> segundo o Portal Gov.br/Receita Federal, pessoas físicas
        residentes no Brasil que recebem rendimentos de &ldquo;locação e sublocação de bens móveis e imóveis&rdquo;
        pagos por outra pessoa física estão obrigadas ao carnê-leão — apuração e recolhimento mensal do IR, com DARF
        emitido no e-CAC, e importação dos dados para a Declaração de Imposto de Renda (DIRPF) no ano seguinte. Isso
        vale para reservas recebidas diretamente do hóspede pessoa física; quando o repasse passa por uma
        plataforma/gestora que atua como intermediária, a mecânica de retenção pode variar — recomenda-se checar com
        contador o tratamento do repasse específico da plataforma usada.
      </p>
      <p>
        <strong>Reforma tributária (IBS/CBS) — o que muda e para quem:</strong> a Lei Complementar 214/2025, no art.
        253, equipara a locação residencial de até 90 dias às regras de hotelaria para fins de IBS/CBS — mas só para
        quem já se enquadra como &ldquo;contribuinte do regime regular&rdquo; desses tributos. A LC 227/2026
        adicionou os §§1º e 2º ao art. 253, remetendo esse enquadramento aos mesmos critérios do art. 251: pessoa
        física que, no ano-calendário anterior, faturou mais de R$ 240 mil com locação de imóveis <strong>e</strong>{" "}
        teve mais de 3 imóveis distintos alugados. Quem fica abaixo de qualquer um dos dois limites continua só no
        IR, como hoje. Para quem se enquadra, há um redutor de R$ 600 por imóvel na base de cálculo mensal e uma
        redução de 40% na alíquota combinada de IBS/CBS (o que deixa o percentual efetivo na faixa de 16%–17%,
        segundo a reportagem consultada). A CBS entra em vigor plena a partir de 2027; o IBS tem transição de 2026 a
        2033 — a regra não é imediata.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Regime</th>
              <th>Quem se enquadra</th>
              <th>O que se paga</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>IR / carnê-leão (regra geral)</td>
              <td>Praticamente todo proprietário pessoa física com locação por temporada</td>
              <td>Tabela progressiva do IR, apurada e recolhida mensalmente</td>
            </tr>
            <tr>
              <td>IBS/CBS (reforma tributária)</td>
              <td>Só quem tem mais de 3 imóveis alugados <strong>e</strong> fatura mais de R$ 240 mil/ano com essa atividade</td>
              <td>IBS + CBS sobre a base de cálculo, com redutor de R$ 600/imóvel/mês e alíquota reduzida em 40%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        O próprio Airbnb, em posicionamento público citado na reportagem consultada, afirmou que &ldquo;a maioria
        das pessoas físicas que alugam imóveis por temporada continuará sujeita apenas ao Imposto de Renda&rdquo; e
        classificou a ideia de um &ldquo;novo imposto generalizado&rdquo; sobre anfitriões pessoa física como
        divulgação incorreta.
      </p>

      <h2>Locação por temporada de casa rende mais que apartamento?</h2>
      <p>
        O comparativo de rentabilidade entre casa e apartamento já está detalhado, com dados e casos reais, em{" "}
        <Link href="/blog/quanto-rende-casa-airbnb-sao-paulo">Quanto Rende uma Casa no Airbnb em São Paulo</Link> e{" "}
        <Link href="/blog/quanto-rende-apartamento-airbnb-sao-paulo">
          Quanto Rende um Apartamento no Airbnb em São Paulo
        </Link>{" "}
        — não repetimos os números aqui.
      </p>
      <p>
        Pelo ângulo jurídico/documental, a diferença real é de complexidade de aprovação, não de potencial de renda:
        casa não depende de convenção de condomínio nem da decisão do STJ (ver seção sobre riscos jurídicos) — a
        decisão do proprietário basta. Apartamento em condomínio pode exigir aprovação de 2/3 dos condôminos se a
        operação for lida como exploração econômica reiterada. Isso não torna a casa &ldquo;melhor&rdquo; em
        rentabilidade — torna o caminho documental mais simples.
      </p>

      <h2>Quais documentos preciso para colocar meu imóvel em locação por temporada?</h2>
      <p>
        Cinco itens cobrem o essencial, direto da lei: contrato escrito com descrição de móveis e utensílios se o
        imóvel for mobiliado (art. 48, parágrafo único); comprovação de propriedade ou de direito de locar
        (matrícula do imóvel ou contrato de locação principal, se sublocando); modalidade de garantia formalizada,
        quando exigida (caução, fiança, seguro-fiança ou cessão fiduciária, art. 37 c/c art. 49); verificação da
        convenção do condomínio e, se necessário, ata de aprovação por 2/3 dos condôminos (pós-STJ); e registro da
        apuração mensal do carnê-leão para a declaração anual de IR.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Documento</th>
              <th>Base legal</th>
              <th>Obrigatório sempre?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Contrato de locação por temporada, com descrição de móveis se mobiliado</td>
              <td>Art. 48, parágrafo único, Lei 8.245/91</td>
              <td>Sim, se o imóvel for mobiliado</td>
            </tr>
            <tr>
              <td>Comprovação de propriedade/matrícula do imóvel</td>
              <td>Registro de imóveis</td>
              <td>Sim, para comprovar legitimidade do locador</td>
            </tr>
            <tr>
              <td>Garantia formalizada (caução, fiança, seguro-fiança ou cessão fiduciária)</td>
              <td>Art. 37 e 49, Lei 8.245/91</td>
              <td>Não é obrigatório por lei ter garantia, mas se exigida precisa constar formalmente</td>
            </tr>
            <tr>
              <td>Convenção do condomínio + ata de aprovação de 2/3, se aplicável</td>
              <td>Arts. 1.336, IV e 1.351, Código Civil; REsp 2.121.055/MG</td>
              <td>Sim, para imóvel em condomínio onde a atividade seja lida como exploração econômica reiterada</td>
            </tr>
            <tr>
              <td>Registro de apuração do carnê-leão (DARF mensal)</td>
              <td>Legislação do IR, orientação Receita Federal</td>
              <td>Sim, sempre que houver rendimento tributável</td>
            </tr>
            <tr>
              <td>Seguro contra danos ao imóvel</td>
              <td>Não é exigência da Lei do Inquilinato — é prática de mercado/da gestora</td>
              <td>Recomendado; obrigatório em todo contrato de gestão da WeCare (EasyCover)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="wc-faq-block">
        <h2>Perguntas frequentes</h2>
        {meta.faq.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>

      <p style={{ marginTop: 32, fontSize: "0.85rem", color: "var(--text-muted)" }}>
        Este conteúdo é informativo e não substitui orientação jurídica ou contábil individual — antes de qualquer
        decisão, consulte um advogado ou contador para o caso específico do seu imóvel.
      </p>
    </>
  );
}

export const post: BlogPost = { meta, Content };
