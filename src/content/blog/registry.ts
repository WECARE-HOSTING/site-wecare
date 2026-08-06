import { post as comoEscolher } from "./posts/como-escolher-empresa-gestao-airbnb";
import { post as semFidelidade } from "./posts/gestao-airbnb-sem-fidelidade";
import { post as casa } from "./posts/quanto-rende-casa-airbnb-sao-paulo";
import { post as apartamento } from "./posts/quanto-rende-apartamento-airbnb-sao-paulo";
import { post as shortStay } from "./posts/short-stay-airbnb";
import { post as coHosting } from "./posts/co-hosting-airbnb";
import { post as alternativasGestoras } from "./posts/alternativas-gestoras-airbnb-sao-paulo";
import { post as anfitriaoProfissional } from "./posts/anfitriao-profissional-airbnb";
import { post as superhost } from "./posts/superhost-airbnb";
import { post as propertyManagement } from "./posts/property-management-airbnb";
import { post as locacaoPorTemporada } from "./posts/locacao-por-temporada";
import { post as gestaoConcierge } from "./posts/gestao-concierge-imoveis-temporada";
import { post as coAnfitriao } from "./posts/co-anfitriao-airbnb";
import { post as comissao } from "./posts/comissao-airbnb";
import { post as ocupacao } from "./posts/ocupacao-airbnb";
import type { BlogPost, BlogPostMeta } from "./types";

// Order = display order on /blog.
export const posts: BlogPost[] = [
  comoEscolher,
  semFidelidade,
  casa,
  apartamento,
  shortStay,
  coHosting,
  alternativasGestoras,
  anfitriaoProfissional,
  superhost,
  propertyManagement,
  locacaoPorTemporada,
  gestaoConcierge,
  coAnfitriao,
  comissao,
  ocupacao,
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.meta.slug === slug);
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.meta.slug);
}

export function getRelatedPosts(meta: BlogPostMeta): BlogPost[] {
  return meta.related.map((slug) => getPost(slug)).filter((p): p is BlogPost => Boolean(p));
}
