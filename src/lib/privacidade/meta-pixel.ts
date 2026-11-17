/**
 * Único lugar do ID do Meta Pixel.
 *
 * Preencha a variável de ambiente META_PIXEL_ID com o ID numérico do
 * Gerenciador de Eventos (só dígitos). Ela é lida em runtime no servidor
 * — em produção, /etc/wecare-site.env, e reinicie o serviço.
 *
 * Vazia, ausente ou diferente de um ID numérico: o Pixel não carrega.
 * Não há ID padrão neste repositório.
 */
export const META_PIXEL_ID_ENV = "META_PIXEL_ID";

const ID_PIXEL = /^\d{5,20}$/;

export function metaPixelId(env: NodeJS.ProcessEnv = process.env): string {
  const bruto = (env[META_PIXEL_ID_ENV] ?? "").trim();
  return ID_PIXEL.test(bruto) ? bruto : "";
}

export function idPixelValido(id: string): boolean {
  return ID_PIXEL.test(id);
}
