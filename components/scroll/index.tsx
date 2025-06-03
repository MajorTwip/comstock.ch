'use client'

import siteMetadata from '@/data/siteMetadata'
import { useTranslation } from 'app/[locale]/i18n/client'
import { LocaleTypes } from 'app/[locale]/i18n/settings'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CommentsIcon, ArrowTopIcon } from './icons'

const ScrollTopAndComment = () => {
  const locale = useParams()?.locale as LocaleTypes
  const { t } = useTranslation(locale, 'common')
  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.scrollY > 50) setShow(true)
      else setShow(false)
    }

    window.addEventListener('scroll', handleWindowScroll)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0 })
  }
  const handleScrollToComment = () => {
    document.getElementById('comment')?.scrollIntoView()
  }


}

export default ScrollTopAndComment
