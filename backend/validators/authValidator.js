const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    full_name: z.string().min(2),
    organization: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    full_name: z.string().min(2).optional(),
    organization: z.string().optional(),
  }),
});


module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
};
