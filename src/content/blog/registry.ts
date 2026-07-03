import { post as comoEscolher } from "./posts/como-escolher-empresa-gestao-airbnb";
import { post as semFidelidade } from "./posts/gestao-airbnb-sem-fidelidade";
import { post as casa } from "./posts/quanto-rende-casa-airbnb-sao-paulo";
import { post as apartamento } from "./posts/quanto-rende-apartamento-airbnb-sao-paulo";
import type { BlogPost, BlogPostMeta } from "./types";

// Order = display order on /blog.
export const posts: BlogPost[] = [comoEscolher, semFidelidade, casa, apartamento];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.meta.slug === slug);
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.meta.slug);
}

export function getRelatedPosts(meta: BlogPostMeta): BlogPost[] {
  return meta.related.map((slug) => getPost(slug)).filter((p): p is BlogPost => Boolean(p));
}
