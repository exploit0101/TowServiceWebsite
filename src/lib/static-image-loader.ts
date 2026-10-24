'use client';

import type { ImageLoaderProps } from 'next/image';

/** Static, pre-sized WebP assets keep responsive images available on GitHub Pages. */
export default function staticImageLoader({ src, width }: ImageLoaderProps): string {
  const sizes = [320, 480, 640, 768, 960, 1200, 1440];
  const selected = sizes.find(size => size >= width) || sizes[sizes.length - 1];
  return /\/images\/easytowing-[a-z-]+\.webp$/.test(src)
    ? src.replace(/\.webp$/, `-${selected}w.webp`)
    : src;
}
