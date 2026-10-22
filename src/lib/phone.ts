/** Native dialer links use an international number; the visible number must match. */
export function getPhoneContact(phone: string, displayPhone: string): { href: string; display: string } | null {
  if (!/^\+1[2-9]\d{2}[2-9]\d{6}$/.test(phone)) return null;
  const display = displayPhone.trim();
  if (!display || !/^[+\d() .-]+$/.test(display)) return null;
  const digits = display.replace(/\D/g, '');
  if ((digits.length === 10 ? `1${digits}` : digits) !== phone.slice(1)) return null;
  return { href: `tel:${phone}`, display };
}
