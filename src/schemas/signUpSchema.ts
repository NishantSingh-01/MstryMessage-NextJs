import z from 'zod'

const userNameValidation = z.string()
    .min(3, "User name at least 3 Character")
    .max(100, "User name at most 100 Character")
    .regex(/^[a-zA-Z0-9]+$/, "User name must be alphanumeric")

export const SignUpSchema = z.object({
    username: userNameValidation,
    email: z.string()
        .email({ message: "Invalid Email" }),
    password: z.string().min(6, "Min 6 Length of Password")
})