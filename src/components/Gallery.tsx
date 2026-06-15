import { useState } from 'react';
import Lightbox, { type SlideImage } from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Inline from 'yet-another-react-lightbox/plugins/inline';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

/**
 * Inline image gallery + lightbox. Ported from the original Next.js site.
 * Posts pass `slides` built from co-located, Astro-optimized image imports
 * (e.g. `import a from './assets/x.jpg'` -> `{ src: a.src, ... }`).
 */
export default function Gallery({ slides }: { slides: SlideImage[] }) {
  const [index, setIndex] = useState(-1);

  return (
    <>
      <Lightbox
        index={Math.max(0, index)}
        slides={slides}
        inline={{
          style: { width: '100%', maxWidth: '900px', aspectRatio: '3 / 2', margin: '1.5rem auto' },
          onClick: ({ index: i }) => setIndex(i),
        }}
        plugins={[Inline, Thumbnails]}
      />
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={Math.max(0, index)}
        slides={slides}
        plugins={[Thumbnails]}
      />
    </>
  );
}
