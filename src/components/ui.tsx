import Link from 'next/link';
import { ArrowUpRight, AlertTriangle, Phone, ArrowRight } from './icons';
import { isLive, callbacksEnabled, callsEnabled, isDemoPhone, phoneContact } from '@/lib/site-config';
export function PrimaryAction({ label }: { label?: string }) {
  return callsEnabled && phoneContact ? <a href={phoneContact.href} className="button button-yellow" aria-label={isDemoPhone ? `Open dialer with demo number ${phoneContact.display}` : undefined}><Phone size={19}/>{isDemoPhone ? 'Call · demo number' : label || 'Call to check availability'}<ArrowUpRight size={18}/></a> : <Link href="/services" className="button button-yellow">Find your next step<ArrowUpRight size={19}/></Link>;
}
export function SafetyNote() {
  return <aside className="safety-note"><AlertTriangle size={22} /><div><strong>Your safety comes first.</strong><p>If there is immediate danger, call 911. Do not use this website while driving or standing in an active traffic lane. This website is not an emergency service.</p></div></aside>;
}
export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <div className="page-intro"><div className="eyebrow"><span />{eyebrow}</div><h1>{title}</h1><div className="page-lead">{children}</div></div>;
}
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li>{items.map((item, i) => <li key={item.label}><span aria-hidden="true">/</span>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current={i === items.length - 1 ? 'page' : undefined}>{item.label}</span>}</li>)}</ol></nav>;
}
export function NextStep() {
  return <section className="next-step"><div><div className="eyebrow">A CLEAR NEXT STEP</div><h2>Let’s make a difficult<br/>moment a little easier.</h2><p>{isLive ? 'Call to check coverage, availability and a quote before you decide.' : 'Call to discuss the help you need, availability and a quote.'}</p></div><div className="next-step-actions"><PrimaryAction />{callbacksEnabled && <Link href="/request-help" className="text-link">Request a callback <ArrowRight size={17}/></Link>}<small>{isLive ? 'Availability and arrival times must be confirmed.' : 'Calling does not confirm a booking or dispatch.'}</small></div></section>;
}
