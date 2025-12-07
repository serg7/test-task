import { z } from 'zod';

export const searchQuerySchema = z.object({
  q: z.string().optional(),
});

export const userIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type UserIdParam = z.infer<typeof userIdSchema>;
