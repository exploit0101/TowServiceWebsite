/** Public, owner-supplied form destination. No API key belongs in the browser. */
export const formspreeEndpoint = 'https://formspree.io/f/xkjjownd';
export const whatsappMessage = 'Hi, I am looking for your towing or roadside assistance services in Winnipeg. Can you help?';

export function whatsappLink(phone: string) {
  if (!/^\+[1-9]\d{6,14}$/.test(phone)) return null;
  return `https://wa.me/${phone.slice(1)}?text=${encodeURIComponent(whatsappMessage)}`;
}

/** Browser-side guidance; Formspree enforces its own validation and spam controls. */
export function validateContact(data: FormData, services: readonly string[]): string | null {
  const value = (key: string) => String(data.get(key) || '').trim();
  if (!value('name') || value('name').length > 80) return 'Please enter your name (up to 80 characters).';
  const phone = value('phone');
  if (!/^[+\d\s().-]+$/.test(phone) || !/^\d{7,15}$/.test(phone.replace(/\D/g, ''))) return 'Please enter a phone number where we can reach you.';
  if (value('location').length < 2 || value('location').length > 200) return 'Please enter your address, nearest intersection or neighbourhood.';
  if (!services.includes(value('service'))) return 'Please choose an available service.';
  const email = value('email');
  if (email.length > 254 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return 'Please check your email address, or leave it blank.';
  if (value('message').length > 2000) return 'Please keep your message under 2,000 characters.';
  if (data.get('consent') !== 'yes') return 'Please agree to be contacted about this request.';
  if (value('_gotcha')) return 'This request could not be submitted. Please call for help.';
  return null;
}
