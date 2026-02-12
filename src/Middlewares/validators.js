import z from "zod";

const authSchema = z.object({
  username: z.string().min(5).max(20),
  password: z.string().min(8).max(20),
});

const userSchema = z.object({
  email: z.email(),
  // username: z.string().min(5).max(20),
  password: z.string().min(8).max(20),
});




export { userSchema, authSchema };
