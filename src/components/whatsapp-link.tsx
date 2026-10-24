import { ArrowUpRight } from './icons';
import { whatsappLink } from '@/lib/contact';

export function WhatsAppLink({ phone }: { phone: string }) {
  const href = whatsappLink(phone);
  if (!href) return null;
  return <a className="footer-whatsapp" href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat with easytowing on WhatsApp (opens in a new tab)">
    <svg viewBox="0 0 24 24" width="25" height="25" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.9 11.9 0 0 0 12.04 0C5.44 0 .07 5.37.06 11.97c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.63a11.96 11.96 0 0 0 5.83 1.49h.01C18.64 23.86 24 18.49 24 11.89a11.88 11.88 0 0 0-3.48-8.41ZM12.04 21.84h-.01a9.93 9.93 0 0 1-5.06-1.38l-.36-.21-3.68.97.98-3.59-.23-.37a9.9 9.9 0 0 1-1.52-5.29c0-5.49 4.47-9.95 9.97-9.95a9.9 9.9 0 0 1 7.04 2.92 9.88 9.88 0 0 1 2.91 7.04c0 5.49-4.47 9.86-10.04 9.86Zm5.46-7.4c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.62-.93-2.21-.24-.58-.49-.5-.68-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.51 0 1.48 1.08 2.91 1.23 3.11.15.2 2.12 3.24 5.14 4.54.72.31 1.28.49 1.72.62.72.23 1.37.2 1.89.12.58-.09 1.77-.73 2.02-1.43.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35Z" /></svg>
    <span>Chat on WhatsApp<small>Message us directly</small></span><ArrowUpRight size={17} aria-hidden="true" />
  </a>;
}
