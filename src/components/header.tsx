"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X, Phone } from "./icons";
import { BrandLogo } from "./brand-logo";
import { ThemeToggle } from './theme-toggle';
import { getPhoneContact } from "@/lib/phone";

type HeaderProps = {
  brand: string;
  phone: string;
  displayPhone: string;
  live: boolean;
  pilotLabel: string;
  phoneMode?: string;
};
export function Header({
  brand,
  phone,
  displayPhone,
  live,
  phoneMode = "unconfigured",
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const chrome = headerRef.current?.closest<HTMLElement>('.site-chrome');
    if (!chrome) return;
    const measure = () => document.documentElement.style.setProperty('--site-chrome-height', `${chrome.getBoundingClientRect().height}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(chrome);
    return () => observer.disconnect();
  }, []);
  const demo = phoneMode === "demo";
  const contact =
    live || demo || phoneMode === "owner-provided" || phoneMode === "verified"
      ? getPhoneContact(phone, displayPhone)
      : null;
  const close = () => setOpen(false);
  const callContent = (
    <>
      <Phone size={18} aria-hidden="true" />
      <span>
        {contact
          ? demo
            ? "Test dialer"
            : "Call now"
          : "Call for roadside help"}
      </span>
      <ArrowUpRight size={17} aria-hidden="true" />
      {!contact && <small>Phone number coming soon</small>}
    </>
  );
  return (
    <>
      {!live && phoneMode !== "owner-provided" && phoneMode !== "verified" && (
        <div className="preview-banner">
          <strong>
            {demo ? "DEMO PHONE · NOT A SERVICE LINE" : "PRE-LAUNCH PREVIEW"}
          </strong>
          {demo
            ? "Test number only. No roadside service or dispatch."
            : "Service is not currently available."}
        </div>
      )}
      <header className="site-header" ref={headerRef}>
        <div className="container header-inner">
          <Link
            href="/"
            className="brand"
            onClick={close}
          >
            <BrandLogo name={brand}/>
          </Link>
          <div className="header-tools"><ThemeToggle/><button
            className="menu-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          </div>
          <nav
            id="main-navigation"
            className={open ? "navigation is-open" : "navigation"}
            aria-label="Main navigation"
          >
            <Link href="/#services" onClick={close}>
              Services
            </Link>
            <Link href="/#fleet" onClick={close}>
              Gallery
            </Link>
            <Link href="/#reviews" onClick={close}>
              Reviews
            </Link>
            <Link href="/#contact" onClick={close}>
              Contact
            </Link>
          </nav>
          <div className="header-contact">
            {contact && (
              <a
                className="header-phone-number"
                href={contact.href}
                onClick={close}
              >
                <span className="header-phone-icon"><Phone size={21} aria-hidden="true" /></span>
                <span className="header-phone-copy"><small>{demo ? "DEMO NUMBER · TEST ONLY" : "Call us now"}</small><strong>{contact.display}</strong></span>
              </a>
            )}
            {contact ? (
              <a
                className="header-call"
                href={contact.href}
                onClick={close}
                aria-label={`${demo ? "Test dialer" : "Call now"}: ${brand} at ${contact.display}`}
              >
                {callContent}
              </a>
            ) : (
              <button className="header-call" disabled>
                {callContent}
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
