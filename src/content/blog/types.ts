import type { ReactNode } from "react";

export type BlogFaqItem = { q: string; a: string };

export type BlogPersonRef = {
  id: string;
  name: string;
  jobTitle: string;
};

export type BlogPostMeta = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  keywords: string[];
  faq: BlogFaqItem[];
  mentions?: BlogPersonRef[];
  related: string[];
};

export type BlogPost = {
  meta: BlogPostMeta;
  Content: () => ReactNode;
};
