import z from "zod";
const querySchema = z.object({
    id: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    type: z.string().min(1).optional(),
    price: z.number().int().positive().optional(),
    state: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    areaSqFt: z.number().int().positive().optional(),
    bedrooms: z.number().int().positive().optional(),
    bathrooms: z.number().int().positive().optional(),
    amenities: z.array(z.string()).optional(),
    furnished: z.enum(["Semi", "Fully", "Unfurnished"]).optional(),
    availableFrom: z.date().optional(),
    listedBy: z.string().min(1).optional(),
    tags: z.array(z.string()).optional(),
    colorTheme: z.string().min(1).optional(),
    rating: z.number().int().min(0).max(5).optional(),
    isVerified: z.boolean().optional(),
    listingType: z.enum(["rent", "sale"]).optional(),
    createdBy: z.string().min(1).optional()
  });
   
  const putSchema = querySchema.omit({
    id: true,
    createdBy: true
  });

export { querySchema, putSchema };