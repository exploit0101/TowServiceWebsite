import Image from 'next/image';

import { publicAssetPath } from '@/lib/asset-path';

export function RoadsideScene() {
  return <figure className="towing-visual">
    <Image
      className="towing-hero-image"
      src={publicAssetPath('/images/towing-3d-hero.webp')}
      width={1448}
      height={1086}
      alt="3D illustration of a yellow flatbed tow truck transporting a silver car."
      sizes="(max-width: 640px) calc(100vw - 44px), (max-width: 1320px) 48vw, 600px"
      preload
    />
    <figcaption>AI-generated 3D illustration · not an actual company fleet</figcaption>
  </figure>;
}
