// Floating contact button for every page. The click is counted as a lead by GtagLeadTracker,
// which listens for any link to wa.me.
const HREF = `https://wa.me/5511969760183?text=${encodeURIComponent("Olá! Vim pelo site da WeCare e gostaria de ajuda.")}`;

export default function WhatsAppFloat() {
  return (
    <a href={HREF} target="_blank" rel="noopener noreferrer" className="wc-wa-float" aria-label="Falar com a WeCare no WhatsApp">
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" fill="currentColor">
        <path d="M16.04 3C9.4 3 4 8.4 4 15.03c0 2.13.56 4.2 1.62 6.03L4 28l7.1-1.86a12.03 12.03 0 0 0 4.94 1.06h.01C22.68 27.2 28 21.8 28 15.17 28 8.4 22.68 3 16.04 3Zm0 21.9h-.01a9.96 9.96 0 0 1-5.08-1.39l-.36-.22-4.2 1.1 1.12-4.1-.24-.38a9.9 9.9 0 0 1-1.52-5.3c0-5.5 4.5-9.97 10.03-9.97 5.52 0 10.02 4.47 10.02 9.97 0 5.5-4.5 10.29-10.02 10.29Zm5.5-7.4c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.25-.24-.58-.5-.5-.68-.5h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.1 3.2 5.1 4.5.72.3 1.28.5 1.7.63.72.23 1.37.2 1.88.12.57-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
      </svg>
    </a>
  );
}
