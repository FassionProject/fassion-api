import { z, ZodType } from 'zod';

export class ProductValidation {
  static readonly CREATE: ZodType = z.object({
    storeId: z.string().nullable().optional(),
    categoryId: z.string().nullable().optional(),
    name: z.string(),
    description: z.string(),
    tagsId: z.array(z.string()).optional(),
    price: z.number().min(1000),
    stock: z.number().min(0),
  });

  static readonly UPDATE: ZodType = z.object({
    categoryId: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    price: z.number().nullable().optional(),
    stock: z.number().nullable().optional(),
  });
}
