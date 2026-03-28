import { z } from "zod";
import { EVENT_TYPES } from "@/lib/constants";

export const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  eventDate: z.string().min(1, "Event date is required"),
  eventType: z.enum(EVENT_TYPES),
  guestCount: z.coerce.number().int("Guest count must be a whole number").min(1, "Guest count must be at least 1"),
  notes: z.string().max(1000, "Notes must be 1000 characters or less").optional(),
});

export const ratingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  stars: z.coerce
    .number()
    .int("Stars must be a whole number")
    .min(1, "Stars must be between 1 and 5")
    .max(5, "Stars must be between 1 and 5"),
  comment: z
    .string()
    .min(5, "Comment is required")
    .max(500, "Comment must be 500 characters or less"),
});
