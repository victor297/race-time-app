import { z } from "zod";

export const PostSchema = z.object({
  location: z.string().nonempty("Location is required"),
  caption: z.string().nonempty("Caption is required"),
});

export type PostFormData = z.infer<typeof PostSchema>;
