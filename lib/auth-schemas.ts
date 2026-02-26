import { z } from "zod"

export const emailSchema = z.object({
  email: z.email({ message: "Enter a valid email address." }),
})

export type EmailFormValues = z.infer<typeof emailSchema>
