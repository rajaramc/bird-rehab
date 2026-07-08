import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    species: z.string().optional(),
    status: z.enum(['In care', 'Released', 'Education bird', 'Update']).default('Update'),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    caption: z.string().optional(),
    gallery: z
      .array(
        z.object({
          src: z.string(),
          caption: z.string().optional(),
        })
      )
      .optional(),
  }),
});

// Editable standalone pages (donate, found-a-bird, about). Each file is a
// singleton the rehabber edits via the CMS "Site pages" collection. The styled
// layout lives in src/pages/*.astro; only the values below are editable, so the
// three-color / minimal design can't be broken from the CMS. Fields are a
// superset across the three pages — each page uses the ones it needs.
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    heading: z.string(),
    intro: z.string().optional(),
    // donate
    venmoHandle: z.string().optional(),
    venmoUrl: z.string().optional(),
    qrImage: z.string().optional(),
    wishlistUrl: z.string().optional(),
    tiers: z.array(z.object({ amount: z.string(), covers: z.string() })).optional(),
    // found-a-bird
    steps: z.array(z.object({ heading: z.string(), text: z.string() })).optional(),
    phone: z.string().optional(),
    phoneLink: z.string().optional(),
    legalNote: z.string().optional(),
  }),
});

export const collections = { posts, pages };
