'use client';

import Image from 'next/image';
import { useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { publicAssetPath } from '@/lib/asset-path';

export type FleetImage = {
  id: string;
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
  generated?: boolean;
};

export function FleetGallery({ images }: { images: readonly FleetImage[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const captionId = useId();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex === null ? undefined : images[selectedIndex];

  function open(index: number, button: HTMLButtonElement) {
    trigger.current = button;
    setSelectedIndex(index);
    dialog.current?.showModal();
  }

  function move(direction: -1 | 1) {
    setSelectedIndex(index => index === null || images.length === 0 ? null : (index + direction + images.length) % images.length);
  }

  return <>
    <div className="fleet-grid">
      {images.map((image, index) => <button className="fleet-tile" key={image.id} type="button" aria-label={`View ${image.label.toLowerCase()} in gallery`} aria-haspopup="dialog" onClick={event => open(index, event.currentTarget)}>
        <Image src={publicAssetPath(image.src)} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw" />
        <span className="fleet-label"><span>{image.label}</span><Expand size={17} aria-hidden="true" /></span>
      </button>)}
    </div>
    <dialog className="fleet-lightbox" ref={dialog} aria-labelledby={titleId} aria-describedby={captionId} onClose={() => {
      setSelectedIndex(null);
      trigger.current?.focus();
    }} onClick={event => {
      if (event.target === event.currentTarget) dialog.current?.close();
    }} onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        move(event.key === 'ArrowLeft' ? -1 : 1);
      }
    }}>
      <div className="lightbox-content">
        <div className="lightbox-toolbar"><h2 id={titleId}>{selected?.label || 'Vehicle gallery'}</h2><button className="lightbox-close" type="button" aria-label="Close gallery" onClick={() => dialog.current?.close()}><X size={22} aria-hidden="true" /></button></div>
        {selected && <figure className="lightbox-figure">
          <div className="lightbox-image"><Image key={selected.id} src={publicAssetPath(selected.src)} alt={selected.alt} width={selected.width} height={selected.height} sizes="(max-width: 1100px) 95vw, 1100px" /></div>
          <figcaption className="lightbox-caption" id={captionId}>Illustrative vehicle image. Equipment varies by job.</figcaption>
        </figure>}
        <div className="lightbox-controls"><button type="button" className="lightbox-previous" aria-label="Previous image" disabled={images.length < 2} onClick={() => move(-1)}><ChevronLeft size={22} aria-hidden="true" /><span>Previous</span></button><span className="lightbox-counter" aria-live="polite" aria-atomic="true">{selectedIndex === null ? '' : `${selectedIndex + 1} of ${images.length}`}</span><button type="button" className="lightbox-next" aria-label="Next image" disabled={images.length < 2} onClick={() => move(1)}><span>Next</span><ChevronRight size={22} aria-hidden="true" /></button></div>
      </div>
    </dialog>
  </>;
}
