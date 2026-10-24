import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs, PageIntro, NextStep, SafetyNote } from '@/components/ui';
import { pageMetadata, StructuredBreadcrumbs } from '@/lib/seo';
import { getAvailability } from '@/lib/availability';
import { isLive, siteConfig, callbacksEnabled, callsEnabled, phoneContact } from '@/lib/site-config';

const pages = {
  about: { name: 'About', title: 'Roadside help, coordinated clearly.', eyebrow: 'ABOUT EASYTOWING', description: 'easytowing coordinates independent towing and roadside partners in Winnipeg. Learn how quotes, service acceptance and dispatch work.' },
  contact: { name: 'Contact', title: 'Call easytowing.', eyebrow: 'CONTACT & AVAILABILITY', description: 'Call easytowing at 672-889-9764 for towing and roadside assistance in Winnipeg. Discuss your vehicle, location, availability and a quote.' },
  'rates-and-disclosures': { name: 'Rates & disclosures', title: 'Know the cost before you agree.', eyebrow: 'QUOTES & SERVICE DETAILS', description: 'Ask about the total CAD quote, taxes, possible additional fees, operator identity and consent before accepting towing or roadside service.' },
  privacy: { name: 'Privacy', title: 'Privacy at easytowing.', eyebrow: 'YOUR INFORMATION', description: 'How easytowing handles service enquiries through Formspree, WhatsApp links, phone contact, appearance preferences and optional analytics.' },
  terms: { name: 'Terms', title: 'Using easytowing.', eyebrow: 'WEBSITE & SERVICE INFORMATION', description: 'Understand enquiries, independent service partners, quotes, consent, destination choices and dispatch confirmation when arranging roadside help.' },
  accessibility: { name: 'Accessibility', title: 'Help using this website.', eyebrow: 'ACCESSIBILITY', description: 'Find information about keyboard navigation, text enlargement, reduced motion and contacting easytowing for help using this website.' },
} as const;

type PageKey = keyof typeof pages;
type Props = { params: Promise<{ page: string }> };

export function generateStaticParams() { return Object.keys(pages).map(page => ({ page })); }
export const dynamicParams = false;
function getPage(slug: string) {
  if (!Object.hasOwn(pages, slug)) notFound();
  return pages[slug as PageKey];
}
export async function generateMetadata({ params }: Props) {
  const slug = (await params).page;
  const page = getPage(slug);
  return pageMetadata(page.name, page.description, `/${slug}`);
}

const availability = getAvailability(siteConfig.availability);
const coverage = siteConfig.coverage?.label || siteConfig.areas.join(', ');
const providerRole = siteConfig.providerRole || 'easytowing coordinates independent towing and roadside partners. The partner accepting your job carries out the on-site work.';
const hours = availability.dispatch24h ? 'Calls and partner dispatch are available 24 hours a day, 7 days a week.'
  : availability.confirmed ? 'Calls are answered 24 hours a day. Check dispatch availability when you call.'
    : siteConfig.serviceHours || 'Call to check availability.';

function PhoneContact() {
  return callsEnabled && phoneContact ? <a href={phoneContact.href}>{phoneContact.display}</a> : <Link href="/contact">Contact easytowing</Link>;
}
function EmailContact() {
  return siteConfig.supportEmail ? <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a> : null;
}

function About() {
  return <>
    <div className="content-grid">
      <section className="content-block">
        <h2>A team for your next step</h2><p>{providerRole}</p>
        <p>Tell the team about your vehicle, the problem and your location. The team checks the service needed, an available partner and a quote before you decide.</p>
        <h2>Know who is helping</h2>
        <p>Confirm the actual operator, who provides the quote, who obtains your consent and who will invoice you. A partner must accept the job before dispatch is confirmed.</p>
        {siteConfig.operatorDetails && <p>{siteConfig.operatorDetails}</p>}
        <Link className="text-link" href="/rates-and-disclosures">Quotes & service details →</Link>
      </section>
      <aside className="service-sidebar">
        <div className="eyebrow">CALL FOR HELP</div><h2>{siteConfig.brandName || 'easytowing'}</h2>
        {siteConfig.legalName && <p>{siteConfig.legalName}</p>}
        {coverage && <p>Towing and roadside assistance across {coverage}.</p>}
        <p>{hours}</p><p>Service eligibility and an arrival estimate are confirmed for each job.</p>
        <p><PhoneContact/></p>
      </aside>
    </div>
    <NextStep/>
  </>;
}

function Contact() {
  return <>
    <div className="contact-info">
      <section className="contact-card"><h2>Phone & enquiries</h2><PhoneContact/><p>Tell us your vehicle, the help you need and your location. Confirm availability and a quote before making plans.</p><p><Link href="/request-help">Send a service enquiry →</Link></p>{siteConfig.supportEmail && <p><EmailContact/></p>}</section>
      <section className="contact-card"><h2>Hours & coverage</h2><p>{hours}</p>{coverage && <p>Service area: {coverage}.</p>}<p>Arrival estimates depend on the job, safe access, weather, traffic and available partners.</p></section>
    </div>
    <section className="document-content"><h2>Questions about a job or a charge</h2><p>Call <PhoneContact/> with the operator’s name and your quote or invoice. Confirm which business provided the service or issued the charge so your question reaches the right team.</p><p>Keep your quote, consent record and invoice. Do not send payment details or identity documents in a general enquiry.</p>{siteConfig.operatorDetails && <p>{siteConfig.operatorDetails}</p>}{callbacksEnabled && <p><Link href="/request-help">Request a callback</Link> for a conversation about service options. A callback request does not confirm booking or dispatch.</p>}</section>
    <SafetyNote/>
  </>;
}

function Rates() {
  return <>
    <div className="content-grid">
      <section className="content-block"><h2>Call for a quote</h2><p>The quote depends on your vehicle, the work, location, destination and equipment needed. Discuss the details with the service team before accepting the job.</p>{isLive && siteConfig.prices.length > 0 && <ul>{siteConfig.prices.map(price => <li key={price}>{price}</li>)}</ul>}
        <h2>Confirm the full cost</h2><ul><li>The operator’s name and the exact service included.</li><li>The total in Canadian dollars and whether taxes are included.</li><li>Any mileage, equipment, waiting, access, storage or other possible fees.</li><li>When the quote could change and how you approve additional work.</li><li>Who receives payment, accepted payment methods, and cancellation or refund terms.</li></ul>
        <h2>Who quotes and invoices?</h2><p>{siteConfig.operatorDetails || 'Ask who provides the quote, obtains your consent, performs the work, issues the invoice and handles questions about charges. Confirm these responsibilities before you agree.'}</p>
      </section>
      <aside className="service-sidebar"><div className="eyebrow">YOUR CHOICE</div><h2>Understand it. Then decide.</h2><p>Ask for written quote information and the operator’s consent process. For a tow, confirm your destination and discuss your options.</p><p>An enquiry or quote discussion does not authorize work or additional charges.</p><Link href="/contact" className="text-link">Contact the team →</Link></aside>
    </div>
    <NextStep/>
  </>;
}

function Privacy() {
  const analyticsEnabled = isLive && siteConfig.approvals.analytics && /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GOOGLE_TAG_ID || '');
  return <div className="document-content">
    <h2>Contacting us</h2><p>Call <PhoneContact/> to discuss roadside assistance or ask a privacy question{siteConfig.supportEmail && <>. You can also email <EmailContact/></>}. Share only the information needed for your enquiry. The website does not request device-location access or payment details.</p>
    <h2>Service enquiry forms</h2><p>EasyTowing uses Formspree to receive your name, phone number, address or location, selected service, optional email and message, and agreement to be contacted. A nearest intersection or neighbourhood is enough for an initial enquiry. We use these details to respond, discuss service options and coordinate appropriate assistance. Consent to contact is not consent to marketing or on-site work. Please do not include payment details, identity documents or other sensitive information.</p><p>Submissions are sent securely to Formspree and made available to EasyTowing. Formspree processes information in the United States and other countries where it operates, where privacy laws may differ from Canadian laws. It may also process technical information, including your IP address, browser and referring website, for delivery and spam prevention. See <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">Formspree’s privacy policy (opens in a new tab)</a>. The website does not save your form entries in browser storage or include them in page URLs. To request access, correction or deletion of enquiry information, call <PhoneContact/>.</p>
    {callbacksEnabled && <><h2>Server-hosted callback requests</h2><p>If a separate callback service is enabled, a short-lived keyed identifier derived from the callback number prevents repeated submissions and expires after 15 minutes. It is separate from the Formspree enquiry form.</p></>}
    <h2>WhatsApp</h2><p>The WhatsApp link opens a chat with our business number and a suggested message. You can edit the message and choose whether to send it. Opening the link takes you to WhatsApp; its privacy policy applies. No WhatsApp chat widget loads on this website.</p>
    <h2>Technical information & analytics</h2><p>The hosting provider may process connection details, such as your IP address and browser information, to deliver and protect the website.</p><p>{analyticsEnabled ? 'Optional Google usage analytics loads only after you choose Allow analytics. You can decline without losing access to the site, and change your choice through Analytics preferences. Analytics may use cookies and process information outside Canada.' : 'This website does not currently load analytics or advertising tags.'}</p>{analyticsEnabled && <p>Page-view information excludes the URL query string. Phone-link clicks are measured as website interactions, not completed calls or bookings. The application does not store advertising click identifiers or campaign parameters.</p>}
    <h2>Appearance preference</h2><p>If you choose light or dark mode, that preference is saved in your browser so it can be remembered on your next visit. It is not sent to the service team or used for advertising. New visitors see the light theme; clearing browser storage resets the preference.</p>
    <h2>Telephone calls</h2><p>Telephone links open your calling app. This website does not record calls. Ask the call handler whether recording is used and how information shared during the call will be handled.</p>
    <h2>Privacy questions</h2><p>Call <PhoneContact/> to ask about your information, corrections, access or a privacy concern. Avoid sending sensitive documents unless the team explains why they are needed and how to provide them.</p>
  </div>;
}

function Terms() {
  return <div className="document-content">
    <h2>Enquiries and service acceptance</h2><p>This website explains towing and roadside options and provides ways to contact easytowing. Reading a page, tapping a phone or WhatsApp link, or submitting an enquiry does not confirm a booking or dispatch. A suitable partner, the service scope, quote and your consent must be confirmed first.</p>
    <h2>Independent service partners</h2><p>{providerRole}</p><p>Confirm the operator’s identity and responsibilities before accepting work. Service depends on suitable equipment, safe access and the partner’s acceptance.</p>{siteConfig.operatorDetails && <p>{siteConfig.operatorDetails}</p>}
    <h2>Quotes, destinations and changes</h2><p>Confirm the total quote, taxes and possible additional charges. For towing, discuss your destination and available choices. Agree any change to the work, destination or cost before it proceeds.</p><p>Ask the operator about payment, cancellation and refund terms before agreeing to service. Keep your quote, consent record and invoice.</p>
    <h2>Availability and safety</h2><p>Arrival times are estimates affected by location, traffic, weather, equipment and safe access. Do not use the website while driving or standing in an active traffic lane. If there is immediate danger, call 911.</p>
    <h2>Questions or concerns</h2><p>Contact <PhoneContact/> about an enquiry or service concern. For a charge or on-site work, also contact the business named on your quote or invoice. See <Link href="/rates-and-disclosures">rates and disclosures</Link> and <Link href="/privacy">privacy information</Link> for more detail.</p>
  </div>;
}

function Accessibility() {
  return <div className="document-content">
    <h2>Using the website</h2><ul><li>Use Tab to move between links and controls, and Enter to follow links.</li><li>Use Enter or Space for navigation and gallery buttons. The gallery can be closed with Escape.</li><li>A skip-to-content link, visible focus indicators and labelled controls help with keyboard navigation.</li><li>Use your browser’s zoom or text-size settings to enlarge the content.</li></ul>
    <h2>Motion and mobile access</h2><p>The site adapts to smaller screens and respects your device’s reduced-motion preference. Reading service information does not require a map or location permission.</p>
    <h2>Get help or report a barrier</h2><p>Call <PhoneContact/>{siteConfig.supportEmail && <> or email <EmailContact/></>} if you need help accessing information or a website control. Tell us which page or action caused difficulty. You do not need to share medical information to report a barrier.</p>
  </div>;
}

export default async function InfoPage({ params }: Props) {
  const slug = (await params).page;
  const page = getPage(slug);
  return <div className="container subpage"><Breadcrumbs items={[{ label: page.name }]}/><PageIntro eyebrow={page.eyebrow} title={page.title}><p>{page.description}</p></PageIntro>{slug === 'about' ? <About/> : slug === 'contact' ? <Contact/> : slug === 'rates-and-disclosures' ? <Rates/> : slug === 'privacy' ? <Privacy/> : slug === 'terms' ? <Terms/> : <Accessibility/>}<StructuredBreadcrumbs items={[{ name: page.name, path: `/${slug}` }]}/></div>;
}
