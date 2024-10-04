import { z, ZodType } from 'zod';

export class ProductReviewValidation {
  static readonly CREATE: ZodType = z.object({
    comment: z.string(),
    productId: z.string(),
    userId: z.string(),
    rating: z.number().min(1).max(5),
  });

  static readonly UPDATE: ZodType = z.object({
    comment: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
  });
}
