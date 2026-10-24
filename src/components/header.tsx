"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu, X, Phone } from "./icons";
import { BrandLogo } from "./brand-logo";
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
      <header className="site-header">
        <div className="container header-inner">
          <Link
            href="/"
            className="brand"
            onClick={close}
          >
            <BrandLogo name={brand}/>
          </Link>
          <button
            className="menu-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
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
                <span>
                  {demo ? "DEMO NUMBER · TEST ONLY" : "LET’S GET YOU MOVING"}
                </span>
                <strong>{contact.display}</strong>
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
