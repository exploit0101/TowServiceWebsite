'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Phone, Play } from 'lucide-react';
import { ServiceIcon } from '@/components/service-icon';
import type { Service } from '@/lib/content';

export type ServiceCarouselProps = {
  items: readonly Service[];
  phoneHref?: string;
  displayPhone?: string;
  defaultExpanded?: boolean;
};

const motionQuery = '(prefers-reduced-motion: reduce)';

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function prefersReducedMotion() {
  return window.matchMedia(motionQuery).matches;
}

function serverMotionPreference() {
  return true;
}

export function ServiceCarousel({ items, phoneHref, displayPhone, defaultExpanded = false }: ServiceCarouselProps) {
  const track = useRef<HTMLDivElement>(null);
  const interaction = useRef({ hovered: false, focused: false, touching: false, manualUntil: 0 });
  const controlState = useRef({ previous: false, next: items.length > 3 });
  const trackId = useId();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(items.length > 3);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [motionRequested, setMotionRequested] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeToMotionPreference, prefersReducedMotion, serverMotionPreference);
  const movementPaused = manuallyPaused || (reducedMotion && !motionRequested);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const updateControls = () => {
      const previous = element.scrollLeft > 4;
      const next = element.scrollLeft + element.clientWidth < element.scrollWidth - 4;
      // Auto-scrolling emits frequent scroll events; only boundaries change React state.
      if (controlState.current.previous !== previous) {
        controlState.current.previous = previous;
        setCanPrevious(previous);
      }
      if (controlState.current.next !== next) {
        controlState.current.next = next;
        setCanNext(next);
      }
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

  useEffect(() => {
    const element = track.current;
    if (!element || expanded || movementPaused || items.length < 2) return;

    let frame = 0;
    let previousTime = 0;
    let position = element.scrollLeft;
    let inView = false;
    let pageVisible = !document.hidden;
    const pauseState = interaction.current;

    const animate = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 50) : 0;
      previousTime = time;
      const maximum = element.scrollWidth - element.clientWidth;
      const isPaused = !inView || !pageVisible || pauseState.hovered || pauseState.focused || pauseState.touching || time < pauseState.manualUntil;

      if (!isPaused && maximum > 1) {
        // Keep fractional progress separately: scrollLeft can be rounded by the browser.
        position += elapsed * 0.035;
        if (position > maximum + 1) position = 0;
        element.scrollLeft = Math.min(position, maximum);
      } else {
        position = element.scrollLeft;
      }
      frame = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = Boolean(entry?.isIntersecting);
      previousTime = 0;
    }, { threshold: 0.15 });
    observer.observe(element);
    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
      previousTime = 0;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [expanded, movementPaused, items.length]);

  function move(direction: -1 | 1) {
    const element = track.current;
    if (!element) return;
    interaction.current.manualUntil = Number.POSITIVE_INFINITY;
    setManuallyPaused(true);
    const card = element.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + parseFloat(getComputedStyle(element).columnGap || '0') : element.clientWidth;
    const visibleCards = Math.max(1, Math.floor((element.clientWidth + 20) / step));
    element.scrollBy({
      left: step * visibleCards * direction,
      behavior: reducedMotion ? 'instant' : 'smooth',
    });
  }

  function toggleMovement() {
    if (movementPaused) {
      interaction.current.manualUntil = 0;
      setMotionRequested(true);
      setManuallyPaused(false);
    } else {
      setManuallyPaused(true);
    }
  }

  return <div className={`service-carousel${expanded ? ' is-expanded' : ''}`} role="region" aria-label="Service options" aria-roledescription={expanded ? undefined : 'carousel'}
    onPointerEnter={event => { if (event.pointerType === 'mouse' || event.pointerType === 'pen') interaction.current.hovered = true; }}
    onPointerLeave={() => { interaction.current.hovered = false; }}
    onFocusCapture={() => { interaction.current.focused = true; }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) interaction.current.focused = false; }}>
    <div className="service-carousel-toolbar">
      <span className="service-carousel-hint"><span className="carousel-hint-dot" aria-hidden="true" />{expanded ? 'Every service. One clear next step.' : 'Find the help you need'}<span className="carousel-swipe-hint">Swipe or use the arrows</span></span>
      {!expanded && <div className="carousel-controls">
        <button type="button" className="carousel-motion-control" aria-controls={trackId} onClick={toggleMovement}>
          {movementPaused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          <span>{movementPaused ? 'Resume movement' : 'Pause movement'}</span>
        </button>
        <button type="button" className="carousel-arrow" aria-label="Previous services" aria-controls={trackId} disabled={!canPrevious} onClick={() => move(-1)}><ChevronLeft size={20} aria-hidden="true" /></button>
        <button type="button" className="carousel-arrow" aria-label="Next services" aria-controls={trackId} disabled={!canNext} onClick={() => move(1)}><ChevronRight size={20} aria-hidden="true" /></button>
      </div>}
    </div>
    <div className={`service-carousel-track${expanded ? ' is-expanded' : ''}`} ref={track} id={trackId} tabIndex={expanded ? undefined : 0} aria-label={expanded ? 'All services' : 'Services, scroll horizontally'}
      onPointerDown={event => {
        if (event.pointerType === 'touch' || event.pointerType === 'pen') {
          interaction.current.touching = true;
          interaction.current.manualUntil = Number.POSITIVE_INFINITY;
          setManuallyPaused(true);
        }
      }}
      onPointerUp={() => { interaction.current.touching = false; }}
      onPointerCancel={() => { interaction.current.touching = false; }}
      onWheel={() => { interaction.current.manualUntil = performance.now() + 6000; }}
      onKeyDown={event => {
      if (expanded || event.target !== event.currentTarget) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        move(event.key === 'ArrowLeft' ? -1 : 1);
      }
    }}>
      {items.map(service => <article className="compact-service-card" key={service.id} data-service-id={service.id}>
        <Link className="compact-service-details" href={`/services/${service.id}`}>
          <span className="compact-service-top"><span className="compact-service-icon"><ServiceIcon icon={service.icon} size={34} /></span><span className="compact-service-number" aria-hidden="true">{service.number}</span></span>
          <h3>{service.name}</h3>
          <p>{service.description}</p>
          <span className="compact-service-link">Explore service <ArrowUpRight size={16} aria-hidden="true" /></span>
        </Link>
        {phoneHref && displayPhone && <a className="compact-service-call" href={phoneHref} aria-label={`Call for help: ${service.name.toLowerCase()} at ${displayPhone}`}><Phone size={14} aria-hidden="true" />Call for help</a>}
      </article>)}
    </div>
    <div className="service-carousel-toggle"><button type="button" className="button button-outline" aria-controls={trackId} aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Show carousel' : 'View all services'}<ArrowUpRight size={16} aria-hidden="true" /></button></div>
  </div>;
}
