'use client'

import Lightbox, { SlideImage } from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Inline from 'yet-another-react-lightbox/plugins/inline'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import { useState } from 'react'

import NextJsImage from './NextJsImage'

export default function Gallery({ slides }: { slides: SlideImage[] }) {
  const [open, setOpen] = useState(false)

  return (
    <Lightbox
      open={open}
      close={() => setOpen(false)}
      slides={slides}
      render={{ slide: NextJsImage }}
      inline={{
        style: { width: '100%', maxWidth: '900px', aspectRatio: '3 / 2' },
      }}
      plugins={[Inline, Thumbnails]}
    />
  )
}
