import { serviceIds } from './service-catalog';
export type CallbackRequest = { phone: string; name: string; service: string; area: string; consent: boolean; website: string };
export function validateRequest(input: unknown): { ok: true; value: CallbackRequest } | { ok: false; error: string } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {ok:false,error:'Please check the request details.'};
  const data = input as Record<string,unknown>;
  if (typeof data.phone !== 'string' || !/^(\+?1[ .-]?)?(\([2-9]\d{2}\)|[2-9]\d{2})[ .-]?\d{3}[ .-]?\d{4}$/.test(data.phone.trim())) return {ok:false,error:'Enter a valid Canadian callback number.'};
  if (typeof data.service !== 'string' || !serviceIds.includes(data.service as typeof serviceIds[number])) return {ok:false,error:'Choose one of the listed services.'};
  if (typeof data.area !== 'string' || data.area.trim().length < 2 || data.area.trim().length > 80 || /[<>\r\n]/.test(data.area)) return {ok:false,error:'Enter a general neighbourhood or intersection, up to 80 characters.'};
  if (data.name !== undefined && (typeof data.name !== 'string' || data.name.length > 60 || /[<>\r\n]/.test(data.name))) return {ok:false,error:'Keep your name under 60 characters, without markup.'};
  if (data.consent !== true) return {ok:false,error:'Consent to a callback is required.'};
  if (data.website) return {ok:false,error:'This request could not be accepted.'};
  const digits = data.phone.replace(/\D/g,'');
  return {ok:true,value:{phone:`+1${digits.length === 11 ? digits.slice(1) : digits}`,name:typeof data.name === 'string' ? data.name.trim() : '',service:data.service,area:data.area.trim(),consent:true,website:''}};
}
