import { allBlogs } from 'contentlayer/generated'
import FeaturedLayout from '@/layouts/FeaturedLayout'
import HomeLayout from '@/layouts/HomeLayout'
import { LocaleTypes } from './i18n/settings'
import { compareDesc } from 'date-fns'

interface PageProps {
  params: Promise<{
    locale: LocaleTypes
  }>
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params

  const posts = allBlogs.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
  const filteredPosts = posts.filter((p) => p.language === locale)
  const hasFeaturedPosts = filteredPosts.filter((p) => p.featured === true)

  return (
    <>
      {hasFeaturedPosts.length > 0 && (
        <FeaturedLayout posts={hasFeaturedPosts} params={{ locale }} />
      )}
      <HomeLayout posts={filteredPosts} params={{ locale }} />
    </>
  )
}
