import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!index.md'], base: './docs' }),
  schema: z.object({ description: z.string().optional() }),
});

export const collections = { docs };
