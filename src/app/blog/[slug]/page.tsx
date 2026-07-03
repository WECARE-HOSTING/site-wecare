import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArticleShell from "@/components/blog/BlogArticleShell";
import { getAllSlugs, getPost, getRelatedPosts } from "@/content/blog/registry";
import { buildBlogPostGraph } from "@/lib/blog-schema";

const SITE_URL = "https://www.wecarehosting.com.br";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${slug}`;
  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      url,
      type: "article",
      publishedTime: post.meta.datePublished,
      modifiedTime: post.meta.dateModified,
      locale: "pt_BR",
      siteName: "WeCare Hosting",
      images: [`${SITE_URL}/brand/wecare-simbolo-solido.png`],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const graph = buildBlogPostGraph(post.meta);
  const related = getRelatedPosts(post.meta);
  const { Content } = post;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <BlogArticleShell meta={post.meta} related={related}>
        <Content />
      </BlogArticleShell>
    </>
  );
}
