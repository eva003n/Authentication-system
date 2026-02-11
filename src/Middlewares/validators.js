import z from "zod";

const userSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(20),
});

export { userSchema };
