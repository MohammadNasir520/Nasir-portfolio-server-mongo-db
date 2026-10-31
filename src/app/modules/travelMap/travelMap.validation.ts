import { z } from "zod";

// 64 districts, and a wish list of a few places each - the caps only stop
// a client from storing arbitrary amounts of data in someone's map.
const saveZodSchema = z.object({
  body: z
    .object({
      name: z.string().trim().max(30).default(""),
      districts: z.array(z.string().min(1).max(40)).max(64),
      places: z.array(z.string().min(1).max(120)).max(400),
    })
    .strict(),
});

export const TravelMapValidation = { saveZodSchema };
