import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type Post = CollectionEntry<'blog'>;

/** Entry id is "<slug>/<lang>" — the directory name is the shared slug. */
export function postSlug(entry: Post): string {
  return entry.id.split('/')[0];
}

const isPublished = (e: Post) => import.meta.env.PROD ? !e.data.draft : true;

/** All posts for a language, newest first. */
export async function getPosts(lang: Lang): Promise<Post[]> {
  const all = await getCollection('blog', (e) => e.data.language === lang && isPublished(e));
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Look up a single post by slug + language. */
export async function getPost(slug: string, lang: Lang): Promise<Post | undefined> {
  const all = await getCollection('blog');
  return all.find((e) => postSlug(e) === slug && e.data.language === lang);
}

/** Does this slug exist in the given language? (for the language switcher) */
export async function hasTranslation(slug: string, lang: Lang): Promise<boolean> {
  return Boolean(await getPost(slug, lang));
}

/** URL-safe tag key — case-insensitive, so "IT" and "it" share one page. */
export function tagSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

export function tagHref(tag: string, lang: Lang): string {
  return `/${lang}/tags/${tagSlug(tag)}/`;
}

/**
 * Tag slugs across both languages. Tags are often translated (drohne/drone), so every
 * slug gets a page in each language — the language switcher then never hits a 404.
 */
export async function getAllTagSlugs(): Promise<string[]> {
  const all = await getCollection('blog', isPublished);
  return [...new Set(all.flatMap((e) => e.data.tags.map(tagSlug)))].sort();
}
