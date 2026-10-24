/* eslint-disable @next/next/no-img-element -- Pre-sized transparent brand art is delivered directly on static hosting. */
import { publicAssetPath } from '@/lib/asset-path';

/** Original, generated towing emblem with native text for a crisp wordmark. */
export function BrandMark({ className = '', hero = false }: { className?: string; hero?: boolean }) {
  const widths = hero ? [320, 480, 640, 768, 960, 1200, 1440] : [112, 224];
  return <span className={`brand-symbol ${className}`} aria-hidden="true">
    <img src={publicAssetPath(`/images/easytowing-emblem-${hero ? 768 : 112}w.webp`)}
      srcSet={widths.map(width => `${publicAssetPath(`/images/easytowing-emblem-${width}w.webp`)} ${width}w`).join(', ')}
      sizes={hero ? '(max-width: 760px) 95vw, 700px' : '(max-width: 960px) 58px, 72px'}
      width={1536} height={1024} alt="" decoding="async" fetchPriority={hero ? 'high' : undefined}/>
  </span>;
}

export function BrandLogo({ name = 'easytowing' }: { name?: string }) {
  return <><BrandMark/><span className="brand-wordmark">{name.toLowerCase() === 'easytowing' ? <><span className="brand-easy">easy</span><span className="brand-towing">towing</span></> : name}<small>TOWING & ROADSIDE</small></span></>;
}
