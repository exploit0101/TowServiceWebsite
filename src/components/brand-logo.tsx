/** Original easytowing vector mark, shared by the wordmark and hero watermark. */
export function BrandMark({ className = '' }: { className?: string }) {
  return <svg className={`brand-symbol ${className}`} viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
    <rect className="brand-symbol-tile" x="2" y="2" width="60" height="60" rx="18" fill="#142b3c" />
    <path d="M12 52h40" stroke="#ffffff" strokeOpacity=".16" strokeWidth="2" strokeLinecap="round" />
    <g className="brand-vehicle">
      <path d="M12 37h25V26h9l8 12v7H12V37Z" fill="#ffc539" />
      <path d="M41 29h3l5 7h-8v-7Z" fill="#142b3c" />
      <path d="M17 36V25l15-11M23 36v-8l11-9" stroke="#ffc539" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path className="brand-hook" d="M34 18v9a4 4 0 0 1-8 0" stroke="#ffc539" strokeWidth="3" strokeLinecap="round" />
      <path d="M13 39h19" stroke="#fff0b5" strokeWidth="2" strokeLinecap="round" />
      <path className="brand-headlight" d="M51 39h3" stroke="#fff5cf" strokeWidth="3" strokeLinecap="round" />
      <g className="brand-wheel"><circle cx="20" cy="45" r="6" fill="#142b3c" /><circle cx="20" cy="45" r="2.5" fill="#ffc539" /></g>
      <g className="brand-wheel"><circle cx="46" cy="45" r="6" fill="#142b3c" /><circle cx="46" cy="45" r="2.5" fill="#ffc539" /></g>
    </g>
    <path className="brand-spark" d="M48 12v6M45 15h6" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
  </svg>;
}

export function BrandLogo({ name = 'easytowing' }: { name?: string }) {
  return <><BrandMark/><span className="brand-wordmark">{name.toLowerCase() === 'easytowing' ? <><span className="brand-easy">easy</span><span className="brand-towing">towing</span></> : name}<small>TOWING & ROADSIDE</small></span></>;
}
