'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'
import { allAuthors } from 'contentlayer/generated'
import { Blog } from 'contentlayer/generated'
import { LocaleTypes } from 'app/[locale]/i18n/settings'
import { useTranslation } from 'app/[locale]/i18n/client'
import { fallbackLng } from 'app/[locale]/i18n/locales'
import SearchContext from './SearchContext'
import SearchModal, { SearchItem } from './SearchModal'

interface SearchProviderProps {
  children: ReactNode
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const locale = useParams()?.locale as LocaleTypes
  const { t } = useTranslation(locale, 'common')
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState<Blog[]>([])

  useEffect(() => {
    async function fetchPosts() {
      if (siteMetadata.search?.local?.searchDocumentsPath) {
        const res = await fetch(siteMetadata.search.local.searchDocumentsPath)
        const json = await res.json()
        setPosts(json)
      }
      setIsLoading(false)
    }
    fetchPosts()
  }, [])

  const authorItems: SearchItem[] = useMemo(() => {
    if (!siteMetadata.multiauthors) return []
    return allAuthors
      .filter((a) => a.language === locale)
      .sort((a, b) => (a.default === b.default ? 0 : a.default ? -1 : 1))
      .map((author) => ({
        id: author.slug,
        name: author.name,
        keywords: '',
        subtitle: locale === fallbackLng ? 'Author' : 'Auteur',
        perform: () => router.push(`/${locale}/about/${author.slug}`),
      }))
  }, [locale, router])

  const items: SearchItem[] = useMemo(() => {
    const blogItems =
      posts?.length && Array.isArray(posts)
        ? posts
            .filter((post) => post.language === locale)
            .map((post) => ({
              id: post.path,
              name: post.title,
              keywords: post?.summary || '',
              subtitle: post.tags.join(', '),
              perform: () => router.push(`/${locale}/blog/${post.slug}`),
            }))
        : []
    return [...authorItems, ...blogItems]
  }, [authorItems, locale, posts, router])

  const toggle = () => setOpen((prev) => !prev)

  return (
    <SearchContext.Provider value={{ open, toggle }}>
      <SearchModal open={open} setOpen={setOpen} items={items} isLoading={isLoading} />
      {children}
    </SearchContext.Provider>
  )
}
