'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { ServiceIcon } from '@/components/service-icon';
import type { Service } from '@/lib/content';

export type ServiceCarouselProps = {
  items: readonly Service[];
  phoneHref?: string;
  displayPhone?: string;
};

export function ServiceCarousel({ items, phoneHref, displayPhone }: ServiceCarouselProps) {
  const track = useRef<HTMLDivElement>(null);
  const trackId = useId();
  const [expanded, setExpanded] = useState(false);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(items.length > 3);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const updateControls = () => {
      setCanPrevious(element.scrollLeft > 4);
      setCanNext(element.scrollLeft + element.clientWidth < element.scrollWidth - 4);
    };
    const frame = requestAnimationFrame(updateControls);
    const observer = new ResizeObserver(updateControls);
    observer.observe(element);
    element.addEventListener('scroll', updateControls, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      element.removeEventListener('scroll', updateControls);
    };
  }, [expanded, items.length]);

  function move(direction: -1 | 1) {
    const element = track.current;
    if (!element) return;
    element.scrollBy({
      left: element.clientWidth * 0.9 * direction,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }

  return <div className={`service-carousel${expanded ? ' is-expanded' : ''}`} role="region" aria-label="Service options" aria-roledescription={expanded ? undefined : 'carousel'}>
    <div className="service-carousel-toolbar">
      <span className="service-carousel-hint">{expanded ? 'All services' : 'Find the help you need'}</span>
      {!expanded && <div className="carousel-controls">
        <button type="button" className="carousel-arrow" aria-label="Previous services" aria-controls={trackId} disabled={!canPrevious} onClick={() => move(-1)}><ChevronLeft size={20} aria-hidden="true" /></button>
        <button type="button" className="carousel-arrow" aria-label="Next services" aria-controls={trackId} disabled={!canNext} onClick={() => move(1)}><ChevronRight size={20} aria-hidden="true" /></button>
      </div>}
    </div>
    <div className={`service-carousel-track${expanded ? ' is-expanded' : ''}`} ref={track} id={trackId} tabIndex={expanded ? undefined : 0} aria-label={expanded ? 'All services' : 'Services, scroll horizontally'} onKeyDown={event => {
      if (expanded || event.target !== event.currentTarget) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        move(event.key === 'ArrowLeft' ? -1 : 1);
      }
    }}>
      {items.map(service => <article className="compact-service-card" key={service.id}>
        <Link className="compact-service-details" href={`/services/${service.id}`}>
          <span className="compact-service-icon"><ServiceIcon icon={service.icon} size={29} /></span>
          <h3>{service.name}</h3>
          <p>{service.short}</p>
          <span className="compact-service-link">Explore service <ArrowUpRight size={16} aria-hidden="true" /></span>
        </Link>
        {phoneHref && displayPhone && <a className="compact-service-call" href={phoneHref} aria-label={`Call ${displayPhone} about ${service.name.toLowerCase()}`}><Phone size={14} aria-hidden="true" />Call about {service.name.toLowerCase()}</a>}
      </article>)}
    </div>
    <div className="service-carousel-toggle"><button type="button" className="button button-outline" aria-controls={trackId} aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Show carousel' : 'View all services'}<ArrowUpRight size={16} aria-hidden="true" /></button></div>
  </div>;
}
