import { z } from "zod"

export const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

export const UpdateProfileSchema = z.object({
  name: z.string().min(1),
})

export const DeleteSessionSchema = z.object({
  sessionId: z.string().min(1),
})
