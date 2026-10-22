import { createHmac } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { callbacksEnabled, siteConfig } from '@/lib/site-config';
import { validateRequest } from '@/lib/request-validation';
export const runtime = 'nodejs';
const response = (error:string,status:number) => NextResponse.json({error},{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:NextRequest) {
  if (!callbacksEnabled) return response('Callback requests are not available. No information has been sent to a service team.',503);
  if (request.headers.get('origin') !== new URL(siteConfig.canonicalDomain).origin) return response('This request origin is not allowed.',403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return response('Use the website request form.',415);
  if (Number(request.headers.get('content-length') || 0) > 4096) return response('The request is too large.',413);
  // Bound streamed input too: Content-Length can be absent or inaccurate.
  let input:unknown;
  try {
    const reader = request.body?.getReader(); if (!reader) return response('The request is empty.',400);
    let length=0; const chunks:Uint8Array[]=[];
    for (;;) { const {done,value} = await reader.read(); if (done) break; length += value.byteLength; if (length > 4096) { await reader.cancel(); return response('The request is too large.',413); } chunks.push(value); }
    input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch { return response('The request could not be read.',400); }
  const validated = validateRequest(input);
  if (!validated.ok) return response(validated.error,400);
  if (!siteConfig.offers.includes(validated.value.service)) return response('That service is not currently available.',400);
  try {
    const redisUrl = new URL(process.env.RATE_LIMIT_REDIS_URL!);
    const webhookUrl = new URL(process.env.CALLBACK_WEBHOOK_URL!);
    if (redisUrl.protocol !== 'https:' || webhookUrl.protocol !== 'https:') return response('The request service is unavailable. Please call instead.',503);
    // Limit by normalized phone, not spoofable forwarded IP headers; keys expire after 15 minutes.
    const key = createHmac('sha256',process.env.RATE_LIMIT_HASH_SECRET!).update(validated.value.phone).digest('hex');
    const rate = await fetch(redisUrl,{method:'POST',headers:{Authorization:`Bearer ${process.env.RATE_LIMIT_REDIS_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify(['EVAL',"local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],900) end; return n",'1',`callback:${key}`]),signal:AbortSignal.timeout(5000),cache:'no-store'});
    if (!rate.ok) throw new Error('Rate limit unavailable');
    const rateData = await rate.json();
    if (typeof rateData.result !== 'number') throw new Error('Rate limit invalid');
    if (rateData.result > 3) return response('Too many requests for this number. Please wait 15 minutes or call instead.',429);
    const delivered = await fetch(webhookUrl,{method:'POST',headers:{Authorization:`Bearer ${process.env.CALLBACK_WEBHOOK_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify({ ...validated.value, website:undefined, requestedAt:new Date().toISOString(),kind:'callback_request_not_dispatch' }),signal:AbortSignal.timeout(8000),cache:'no-store',redirect:'error'});
    if (!delivered.ok) throw new Error('Delivery unavailable');
    return NextResponse.json({received:true,dispatched:false},{headers:{'Cache-Control':'no-store'}});
  } catch { return response('Receipt could not be confirmed. Please call instead of resubmitting; no dispatch is confirmed.',503); }
}
