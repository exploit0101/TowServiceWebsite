'use client';

import { useState } from 'react';
import { Pause, Play } from 'lucide-react';

type TickerService = { id: string; name: string };

export function ServiceTicker({ items }: { items: readonly TickerService[] }) {
  const [paused, setPaused] = useState(false);
  if (!items.length) return null;

  return <div className={`service-ticker${paused ? ' is-paused' : ''}`} role="region" aria-label="Our services">
    <div className="container service-ticker-inner">
      <span className="service-ticker-label">OUR SERVICES</span>
      <div className="service-ticker-window" tabIndex={0} aria-label="Service names, scroll horizontally">
        <div className="service-ticker-track">
          <ul className="service-ticker-group">
            {items.map(service => <li key={service.id}>{service.name}</li>)}
          </ul>
          <ul className="service-ticker-group service-ticker-copy" aria-hidden="true">
            {items.map(service => <li key={service.id}>{service.name}</li>)}
          </ul>
        </div>
      </div>
      <button className="service-ticker-pause" type="button" aria-label={paused ? 'Resume service names' : 'Pause service names'} aria-pressed={paused} onClick={() => setPaused(!paused)}>
        {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
      </button>
    </div>
  </div>;
}
