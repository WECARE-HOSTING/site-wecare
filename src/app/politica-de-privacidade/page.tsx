import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const A_CONFIRMAR = "[A CONFIRMAR]";

export const metadata: Metadata = {
  title: "Política de Privacidade | WeCare Hosting",
  description:
    "Como a WeCare Hosting trata os dados pessoais que você informa nos formulários do site e nos anúncios da Meta, nos termos da LGPD.",
  alternates: { canonical: "https://www.wecarehosting.com.br/politica-de-privacidade" },
};

export default function PoliticaDePrivacidadePage() {
  return (
    <div style={{ background: "var(--surface-page)", overflowX: "hidden" }}>
      <Nav />
      <main>
        <article style={{ padding: "clamp(128px, 13vw, 168px) 0 clamp(80px, 9vw, 120px)" }}>
          <div className="wc-container" style={{ maxWidth: 760 }}>
            <nav aria-label="Breadcrumb" style={{ marginBottom: 28 }}>
              <ol
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                }}
              >
                <li>
                  <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li style={{ color: "var(--text-strong)" }}>Política de Privacidade</li>
              </ol>
            </nav>

            <div className="wc-eyebrow">
              <span className="wc-label" style={{ color: "var(--gold-700)" }}>
                Privacidade
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 500,
                fontSize: "clamp(2.1rem, 1.5rem + 2.4vw, 3.1rem)",
                lineHeight: 1.16,
                letterSpacing: "-0.01em",
                color: "var(--text-strong)",
                margin: "0 0 18px",
              }}
            >
              Política de Privacidade
            </h1>

            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 48px" }}>
              Atualizada em 03/11/2026 · WeCare Hosting
            </p>

            <div className="wc-prose">
              <p>
                Esta página explica como a WeCare Hosting trata os dados pessoais que você nos informa. Ela vale para o
                site wecarehosting.com.br, para os formulários deste site e para os formulários de anúncios da Meta
                (Facebook e Instagram).
              </p>

              <h2>Quem é o controlador</h2>
              <p>
                Quem decide como os seus dados são usados é a WeCare Hosting. Para a LGPD, o controlador é a empresa
                abaixo.
              </p>
              <ul>
                <li>
                  <strong>Nome:</strong> WeCare Hosting
                </li>
                <li>
                  <strong>Razão social:</strong> We Care Hosting Serviços Ltda
                </li>
                <li>
                  <strong>CNPJ:</strong> {A_CONFIRMAR}
                </li>
                <li>
                  <strong>Endereço:</strong> Rua Eduardo Souza Aranha, 67, São Paulo/SP
                </li>
                <li>
                  <strong>E-mail para privacidade:</strong> {A_CONFIRMAR}
                </li>
                <li>
                  <strong>Telefone:</strong> <a href="tel:+551150392569">+55 11 5039-2569</a>
                </li>
                <li>
                  <strong>WhatsApp:</strong>{" "}
                  <a href="https://wa.me/5511969760183" target="_blank" rel="noopener noreferrer">
                    +55 11 96976-0183
                  </a>
                </li>
              </ul>
              <p>
                O encarregado pelo tratamento de dados pessoais é contatado pelo e-mail de privacidade indicado acima.
              </p>

              <h2>Quais dados coletamos</h2>
              <h3>Formulários do site e dos anúncios da Meta</h3>
              <p>Quando você preenche um formulário no site ou um formulário de anúncio da Meta, coletamos:</p>
              <ul>
                <li>seu nome;</li>
                <li>seu WhatsApp;</li>
                <li>seu e-mail;</li>
                <li>dados do imóvel: número de quartos, cidade e bairro;</li>
                <li>se o imóvel já é alugado por temporada;</li>
                <li>se o imóvel é seu.</li>
              </ul>
              <p>
                Esses dados servem para a gente te responder. Nesses formulários, não pedimos dados sobre saúde,
                religião, opinião política ou biometria.
              </p>
              <h3>Reserva pelo site</h3>
              <p>
                Se você reserva uma estadia em <Link href="/reservas">/reservas</Link>, o formulário pede nome,
                sobrenome, e-mail e telefone, além das datas e do número de hóspedes. Quando o pagamento online está
                disponível, você informa o pagamento na página da InfinitePay. A WeCare não guarda o número do cartão. A
                reserva fica registrada no sistema de reservas (Hostaway), com o que for necessário para confirmar a
                estadia.
              </p>

              <h2>Para que usamos os seus dados</h2>
              <p>Usamos os dados dos formulários de contato e dos anúncios da Meta para duas coisas:</p>
              <ul>
                <li>contato comercial com você;</li>
                <li>avaliação do imóvel para gestão de locação por temporada.</li>
              </ul>
              <p>
                Os dados da reserva servem para concluir a estadia que você pediu: confirmar as datas, receber o
                pagamento e te enviar a confirmação.
              </p>
              <p>Não usamos os seus dados para tomar uma decisão exclusivamente automatizada a seu respeito.</p>

              <h2>Base legal</h2>
              <p>
                A Lei Geral de Proteção de Dados (Lei nº 13.709/2018) exige uma base legal para cada uso. Aqui, as
                bases são estas:
              </p>
              <ul>
                <li>
                  <strong>Procedimentos preliminares a um contrato, a seu pedido (art. 7º, V).</strong> Vale quando você
                  pede contato e a avaliação do imóvel, ou quando começa uma reserva.
                </li>
                <li>
                  <strong>Execução de contrato (art. 7º, V).</strong> Vale quando a reserva ou a gestão seguem adiante e
                  precisamos cumprir o que foi combinado com você.
                </li>
                <li>
                  <strong>Legítimo interesse (art. 7º, IX).</strong> Vale para medir, de forma agregada, como o site é
                  usado (Google Analytics) e para organizar o atendimento do contato que você iniciou. Esse interesse
                  não se sobrepõe aos seus direitos. Você pode se opor a esse uso pelo canal no final desta página.
                </li>
                <li>
                  <strong>Cumprimento de obrigação legal (art. 7º, II).</strong> Vale quando uma lei exige que a gente
                  guarde algum registro.
                </li>
              </ul>

              <h2>Com quem compartilhamos</h2>
              <p>Compartilhamos os seus dados só com quem precisa deles para as finalidades acima.</p>
              <ul>
                <li>
                  <strong>Meta (Facebook, Instagram e WhatsApp).</strong> Se você envia um formulário de anúncio, a Meta
                  nos entrega o que você preencheu. A Meta também trata esses dados na plataforma dela, conforme a{" "}
                  <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">
                    política de privacidade da Meta
                  </a>
                  . No atendimento, usamos o WhatsApp, que é um serviço da Meta.
                </li>
                <li>
                  <strong>Ferramentas de atendimento.</strong> Para ler o seu pedido e te responder, usamos ferramentas
                  de atendimento. Elas recebem só o necessário para essa conversa.
                </li>
                <li>
                  <strong>Google.</strong> O Google Analytics recebe dados de navegação, descritos na seção de cookies.
                </li>
                <li>
                  <strong>Pagamento e reserva.</strong> Na reserva online, a InfinitePay recebe nome, e-mail e telefone
                  para processar o pagamento, e o Hostaway recebe os dados da estadia para registrar a reserva.
                </li>
              </ul>
              <p>
                A Meta e o Google podem tratar dados fora do Brasil. Essa transferência acontece para as finalidades
                desta política e nas hipóteses em que a LGPD permite transferência internacional (art. 33).
              </p>

              <h2>Por quanto tempo guardamos</h2>
              <p>
                Guardamos os dados do contato e da avaliação do imóvel enquanto essa conversa e essa avaliação estiverem
                em andamento. Se o contato virar um contrato, guardamos pelo tempo do contrato.
              </p>
              <p>
                Quando a finalidade acaba, apagamos ou anonimizamos os dados, salvo se uma obrigação legal pedir a
                guarda — por exemplo, um registro que a lei fiscal exija manter, ou um dado necessário para defender um
                direito em processo.
              </p>
              <p>
                O cookie de idioma da área de reservas dura até 1 ano. Os cookies do Google Analytics ficam no seu
                navegador até você apagá-los ou até expirarem, conforme a configuração do Google.
              </p>

              <h2>Os seus direitos</h2>
              <p>
                Você, como titular dos dados, pode pedir à WeCare, a qualquer momento, o que o art. 18 da LGPD garante:
              </p>
              <ul>
                <li>confirmação de que tratamos dados seus;</li>
                <li>acesso a esses dados;</li>
                <li>correção de dados incompletos, inexatos ou desatualizados;</li>
                <li>anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a lei;</li>
                <li>portabilidade a outro fornecedor, quando a regulamentação da ANPD se aplicar;</li>
                <li>eliminação dos dados tratados com o seu consentimento, salvo as hipóteses do art. 16 da LGPD;</li>
                <li>informação sobre as empresas e os órgãos com os quais compartilhamos os seus dados;</li>
                <li>
                  informação sobre a possibilidade de não fornecer consentimento e sobre o que acontece se você recusar,
                  quando o tratamento depender de consentimento;
                </li>
                <li>revogação do consentimento.</li>
              </ul>
              <p>Para exercer um desses direitos:</p>
              <ol>
                <li>
                  Escreva para {A_CONFIRMAR} dizendo o que você quer (acesso, correção, eliminação ou outro pedido da
                  lista) e um meio de confirmarmos que o pedido é seu.
                </li>
                <li>
                  Se preferir, fale pelo telefone <a href="tel:+551150392569">+55 11 5039-2569</a> ou pelo WhatsApp{" "}
                  <a
                    href="https://wa.me/5511969760183?text=Quero%20exercer%20um%20direito%20sobre%20os%20meus%20dados%20pessoais"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +55 11 96976-0183
                  </a>
                  .
                </li>
              </ol>
              <p>
                A confirmação de que tratamos dados seus, ou o acesso a eles, sai de forma simples em seguida ou em
                declaração completa em até 15 dias, como prevê o art. 19 da LGPD.
              </p>
              <p>
                Se o pedido não for atendido, você pode apresentar uma petição à Autoridade Nacional de Proteção de
                Dados (ANPD), em{" "}
                <a href="https://www.gov.br/anpd/pt-br" target="_blank" rel="noopener noreferrer">
                  gov.br/anpd
                </a>
                .
              </p>

              <h2>Cookies e analytics</h2>
              <p>
                O site usa o Google Analytics. Ao navegar, o Google Analytics grava cookies no seu navegador para
                reconhecer visitas, ver quais páginas foram abertas e entender o uso do site, inclusive aparelho e
                região de forma aproximada. Usamos isso para melhorar as páginas. Não usamos esses cookies para montar
                um anúncio personalizado seu dentro do site.
              </p>
              <p>
                O script do Google Analytics carrega junto com as páginas. Se você não quiser esse cookie, pode
                bloqueá-lo ou apagá-lo nas configurações do navegador, ou instalar o{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                  complemento de desativação do Google Analytics
                </a>
                . O site continua acessível. A forma como o Google trata esses dados está na{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                  política de privacidade do Google
                </a>
                .
              </p>
              <p>
                Na área de reservas, se você escolhe um idioma, gravamos o cookie <strong>rs-lang</strong> por até um
                ano, só para lembrar essa preferência. Ele não identifica você para anúncio.
              </p>

              <h2>Atualização desta política</h2>
              <p>
                Esta política foi atualizada em 03/11/2026. Quando o texto mudar, a data no topo desta página muda
                junto.
              </p>

              <h2>Como falar com a gente</h2>
              <p>
                Para exercer um direito ou tirar uma dúvida sobre os seus dados, escreva para {A_CONFIRMAR}. Enquanto
                esse e-mail não estiver publicado, você também pode usar o telefone e o WhatsApp indicados acima.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
