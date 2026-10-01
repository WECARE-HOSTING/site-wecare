// Same WeCare sales number the rest of the site uses (CTAFinal, Footer).
const WA = "https://wa.me/5511969760183";

export const whatsappLink = (text: string) => `${WA}?text=${encodeURIComponent(text)}`;
