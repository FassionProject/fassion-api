import { z, ZodType } from 'zod';

export class ProductTagValidation {
  static readonly CREATE: ZodType = z.object({
    storeId: z.string().nullable().optional(),
    description: z.string(),
  });

  static readonly UPDATE: ZodType = z.object({
    description: z.string().optional(),
  });
}
