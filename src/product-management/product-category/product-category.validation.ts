import { z, ZodType } from 'zod';

export class ProductCategoryValidation {
  static readonly CREATE: ZodType = z.object({
    description: z.string(),
    parentId: z.string().nullable().optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    description: z.string().optional(),
    parentId: z.string().nullable().optional(),
  });
}
