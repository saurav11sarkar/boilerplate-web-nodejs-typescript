import z from 'zod';

const userSchema = z.object({
  name: z.string('Name is required').min(3),
  email: z.string('Email is required').email('Invalid email'),
  password: z.string('Password is required').min(6),
  role: z.enum(['admin', 'user']).default('user'),
});

const updateUserSchema = userSchema.partial();

export const userValidation = {
  userSchema,
  updateUserSchema,
};
