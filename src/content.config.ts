import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const LOCALES = ['de', 'en'] as const;

// Posts: src/content/blog/<slug>/{de,en}.mdx  →  id = "<slug>/<lang>"
const blog = defineCollection({
  loader: glob({ pattern: '**/{de,en}.mdx', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      lastmod: z.coerce.date().optional(),
      language: z.enum(LOCALES),
      summary: z.string().optional(),
      tags: z.array(z.string()).default([]),
      authors: z.array(z.string()).default(['MajorTwip']),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      image: image().optional(),
      images: z.array(image()).optional(),
      series: z.object({ title: z.string(), order: z.number() }).optional(),
      canonicalUrl: z.string().optional(),
    }),
});

// Skill tree: one file per project at src/content/skilltree/<project>.md
// Each project's frontmatter holds localized meta + a `nodes` array describing
// the DAG (a node lists the ids it `requires`). A node becomes "acquired" when
// its `post` slug resolves to a published blog post — see src/lib/skills.ts.
const localized = z.object({ de: z.string(), en: z.string() });

const skilltree = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/skilltree' }),
  schema: z.object({
    title: localized,
    order: z.number().default(0),
    goal: localized.optional(),
    nodes: z
      .array(
        z.object({
          id: z.string(),
          title: localized,
          desc: localized.optional(),
          requires: z.array(z.string()).default([]),
          post: z.string().optional(),
          // Override the post-derived status when a milestone has no post.
          status: z.enum(['done', 'planned']).optional(),
        }),
      )
      .default([]),
  }),
});

// Authors: src/content/authors/<name>.<lang>.md  →  id = "<name>.<lang>"
const authors = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/authors' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      language: z.enum(LOCALES),
      avatar: image().optional(),
      occupation: z.string().optional(),
      company: z.string().optional(),
      email: z.string().optional(),
      github: z.string().optional(),
      linkedin: z.string().optional(),
      x: z.string().optional(),
    }),
});

export const collections = { blog, authors, skilltree };
