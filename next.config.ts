import type { NextConfig } from "next";

// Legacy WordPress site (live until 2025-09, replaced by this Next.js one-pager
// without a redirect plan) — these URLs still carry real Search Console
// impressions/rankings. Mapped from a Wayback Machine CDX crawl, see
// SEO Team/1-technical-schema/output/2026-07-03_legacy-404-redirects.md for the
// full audit and reasoning behind each destination.
const exactLegacyRedirects = [
  // High-signal individual pages (real impressions in the last 12 months)
  { source: "/proprietarios", destination: "/#servicos" },
  { source: "/quem-somos", destination: "/#historia" },
  { source: "/contato", destination: "/#avaliar" },
  { source: "/pousadas", destination: "/" },
  { source: "/supervisao-de-hospedagem", destination: "/#servicos" },
  { source: "/vantagens-do-aluguel-por-temporada", destination: "/" },
  { source: "/post/vantagens-do-aluguel-por-temporada", destination: "/" },
  { source: "/como-fazer-um-diario-de-viagem", destination: "/" },
  {
    source: "/seu-imovel-pode-render-mais-com-aluguel-por-temporada",
    destination: "/blog/quanto-rende-casa-airbnb-sao-paulo",
  },
  { source: "/dicas-para-anfitrioes-do-airbnb", destination: "/blog/gestao-airbnb-sem-fidelidade" },
  { source: "/como-receber-hospedes", destination: "/blog/gestao-airbnb-sem-fidelidade" },

  // Rentability / market cluster -> closest existing blog post
  { source: "/mercado-de-aluguel-por-temporada", destination: "/blog/quanto-rende-apartamento-airbnb-sao-paulo" },
  { source: "/ganhar-dinheiro-com-aluguel-de-temporada", destination: "/blog/quanto-rende-apartamento-airbnb-sao-paulo" },
  { source: "/alugue-por-temporada-em-sao-paulo", destination: "/blog/quanto-rende-apartamento-airbnb-sao-paulo" },
  { source: "/aluguel-de-temporada", destination: "/blog/quanto-rende-apartamento-airbnb-sao-paulo" },
  { source: "/aluguel-de-curta-temporada", destination: "/blog/quanto-rende-apartamento-airbnb-sao-paulo" },
  { source: "/aumentar-reservas-airbnb", destination: "/blog/como-escolher-empresa-gestao-airbnb" },
  { source: "/otimizar-check-in-e-check-out", destination: "/#servicos" },

  // Guest/travel content with no current equivalent -> blog index (closest still-relevant landing)
  { source: "/como-planejar-uma-viagem-sem-estresse", destination: "/blog" },
  { source: "/cuidados-ao-escolher-uma-hospedagem-para-passar-o-inverno", destination: "/blog" },
  { source: "/tipos-de-hospedagem-no-inverno", destination: "/blog" },
  { source: "/turismo-sustentavel-o-que-e-e-qual-sua-importancia", destination: "/blog" },
  { source: "/viajar-e-um-ato-de-sanidade", destination: "/blog" },
  { source: "/onde-passar-o-reveillon", destination: "/blog" },
  { source: "/qual-o-cenario-do-seu-proximo-evento", destination: "/blog" },
  { source: "/trancoso-tudo-que-voce-precisar-saber-sobre-o-destino", destination: "/blog" },
  { source: "/conheca-a-villa-arapiuns", destination: "/blog" },
  { source: "/edificio-chopin-no-rio-curiosidades-e-historia", destination: "/blog" },
  { source: "/elementor-2535", destination: "/" },
];

const prefixLegacyRedirects = [
  // Individual property listings (old portfolio) -> current curated portfolio section
  { source: "/imoveis/:path*", destination: "/#portfolio" },

  // Old location landing pages -> homepage (no location pages exist today)
  { source: "/localizacoes/:path*", destination: "/" },

  // WordPress taxonomy/utility pages with no content value -> homepage
  { source: "/category/:path*", destination: "/" },
  { source: "/author/:path*", destination: "/" },
  { source: "/propriedade/:path*", destination: "/" },
  { source: "/compras/:path*", destination: "/" },
  { source: "/precos/:path*", destination: "/" },
  { source: "/quarto/:path*", destination: "/" },
];

// Every legacy WordPress URL was served with a trailing slash. Next's own
// trailingSlash:false normalization strips it with a 308 before redirects()
// ever runs, so a real hit (e.g. /proprietarios/) chains two permanent
// redirects instead of one — expected, harmless, and not worth a site-wide
// trailingSlash:true change just for this.
const legacyRedirects = [...exactLegacyRedirects, ...prefixLegacyRedirects].map((r) => ({
  ...r,
  permanent: true,
}));

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
