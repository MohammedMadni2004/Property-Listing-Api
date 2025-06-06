import { z } from 'zod';

const propertySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.string().min(1),
  price: z.number().int().positive(),
  state: z.string().min(1),
  city: z.string().min(1),
  areaSqFt: z.number().int().positive(),
  bedrooms: z.number().int().positive(),
  bathrooms: z.number().int().positive(),
  amenities: z.array(z.string()).default([]),
  furnished: z.enum(["Semi", "Furnished", "Unfurnished"]),
  availableFrom: z.coerce.date(),
  listedBy: z.string().min(1),
  tags: z.array(z.string()).default([]),
  colorTheme: z.string().min(1),
  rating: z.number().int().min(0).max(5).default(0),
  isVerified: z.boolean().default(false),
  listingType: z.enum(["rent", "sale"])
});

export default propertySchema;