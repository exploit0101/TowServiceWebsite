'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, Menu, X, Phone } from './icons';
import { getPhoneContact } from '@/lib/phone';
export function Header({ brand, phone, displayPhone, live, pilotLabel, phoneMode = 'unconfigured' }: { brand: string; phone: string; displayPhone: string; live: boolean; pilotLabel: string; phoneMode?: string }) {
  const [open, setOpen] = useState(false);
  const demo = phoneMode === 'demo';
  const contact = live || demo ? getPhoneContact(phone, displayPhone) : null;
  const canCall = Boolean(contact);
  const callContent = <>
    <span className="header-call-icon"><Phone size={20} aria-hidden="true" /></span>
    <span className="header-call-copy"><strong>{canCall ? (demo ? 'Test dialer' : 'Call now') : 'Call for roadside help'}</strong><small>{canCall ? (demo ? 'Demo number only' : 'Open your phone dialer') : 'Phone number coming soon'}</small></span>
    <ArrowUpRight className="header-call-arrow" size={20} aria-hidden="true" />
  </>;
  return <>
    {!live && <div className="preview-banner"><span>{demo ? 'DEMO PHONE · NOT A SERVICE LINE' : 'PRE-LAUNCH PREVIEW'}</span>{demo ? 'Test number only. No roadside service or dispatch.' : 'Service is not currently available.'}<span className="preview-pilot">Pilot: {pilotLabel}</span></div>}
    <header className="site-header"><div className="container header-inner">
      <Link href="/" className="brand" aria-label={`${brand} home`} onClick={() => setOpen(false)}><span className="brand-mark"><span /><span /><span /></span><span>{brand}<small>ASSISTANCE & TOWING</small></span></Link>
      <button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav id="main-navigation" className={open ? 'navigation is-open' : 'navigation'} aria-label="Main navigation">
        <Link href="/services" onClick={() => setOpen(false)}>Our services</Link><Link href="/#how-it-works" onClick={() => setOpen(false)}>How it works</Link><Link href="/about" onClick={() => setOpen(false)}>About</Link><Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
      </nav>
      <div className={`header-contact${contact ? ' has-phone' : ''}`}>
        {contact && <a className="header-phone-number" href={contact.href} aria-label={`${demo ? 'Demo number' : 'Call'} ${contact.display}`} onClick={() => setOpen(false)}><span>{demo ? 'DEMO NUMBER · TEST ONLY' : 'CALL OR DIAL DIRECTLY'}</span><strong>{contact.display}</strong></a>}
        {contact ? <a className="header-call" href={contact.href} aria-label={`${demo ? 'Open dialer with demo number' : 'Call roadside help at'} ${contact.display}`} onClick={() => setOpen(false)}>{callContent}</a> : <button type="button" className="header-call" disabled aria-label="Call for roadside help — phone number coming soon">{callContent}</button>}
      </div>
    </div></header>
  </>;
}
