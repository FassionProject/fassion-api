import { z, ZodType } from 'zod';

export class ProductImageValidation {
  static readonly CREATE: ZodType = z.object({
    productId: z.string(),
    images: z.array(
      z.object({
        mimetype: z.string().refine((value) => value.includes('image/'), {
          message: 'Must be an image',
        }),
        buffer: z.instanceof(Buffer).or(z.string()).or(z.array(z.string())),
      }),
    ),
  });

  static readonly UPDATE: ZodType = z.object({
    description: z.string().optional(),
  });
}
