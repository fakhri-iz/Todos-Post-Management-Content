import { z } from "zod";

export const exampleSchema = z.object({
  name: z.string().min(3),
});

export const signUpSchema = z.object({
  name: z.string().min(5),
  email: z.string().email(),
  password: z.string().min(5),
});

export const signInSchema = signUpSchema.omit({ name: true });

export const mutateContentSchema = z.object({
  name: z.string().min(5),
  platformId: z.string(),
  tagline: z.string().min(5),
  description: z.string().min(10),
});

export const mutateMaterialContentSchema = z.object({
  title: z.string().min(5),
  type: z.string(),
  videoId: z.string().optional(),
  text: z.string().optional(),
  contentId: z.string().min(5),
});
