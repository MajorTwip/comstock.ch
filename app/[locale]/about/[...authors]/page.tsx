import { Metadata } from 'next'
import { Authors, allAuthors } from 'contentlayer/generated'
import AuthorLayout from '@/layouts/AuthorLayout'
import { genPageMetadata } from 'app/[locale]/seo'
import { createTranslation } from 'app/[locale]/i18n/server'
import { LocaleTypes } from 'app/[locale]/i18n/settings'
import { notFound } from 'next/navigation'
import { getMDXComponent } from 'next-contentlayer2/hooks'

interface PageProps {
  params: Promise<{
    authors: string[]
    locale: LocaleTypes
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata | undefined> {
  const { authors, locale } = await params
  const authorSlug = decodeURI(authors.join('/'))
  const author = allAuthors.find((a) => a.slug === authorSlug && a.language === locale) as Authors
  if (!author) {
    return
  }
  const { t } = await createTranslation(locale, 'about')

  return genPageMetadata({
    title: `${t('about')} ${author.name}`,
    params: { locale },
  })
}

export default async function Page({ params }: PageProps) {
  const { authors, locale } = await params
  const authorSlug = decodeURI(authors.join('/'))
  const author = allAuthors.find((a) => a.slug === authorSlug && a.language === locale) as Authors
  const authorIndex = allAuthors.findIndex((p) => p.slug === authorSlug)
  if (authorIndex === -1) {
    return notFound()
  }
  const mainContent = (author)

  const MDXContent = getMDXComponent(author.body.code)
  
  return (
    <AuthorLayout params={{ locale }} content={mainContent}>
        <MDXContent/>
    </AuthorLayout>
  )
}
