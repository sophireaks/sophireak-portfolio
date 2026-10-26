import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().min(1).max(40),
    summary: z.string().min(1).max(200),
    tags: z.array(z.string().min(1)).min(1),
    /** Position in the gallery and the project list. */
    order: z.number().int().nonnegative(),
    /** Which mock window the gallery draws for this project. */
    mock: z.enum(['terminal', 'dashboard', 'phone', 'chat', 'physics', 'inspector']),
    /** Only set URLs that are real. Pages omit the button when a field is missing. */
    repo: z.url().optional(),
    demo: z.url().optional(),
  }),
});

export const collections = { projects };
