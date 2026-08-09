import z from 'zod'


export const SignInSchema = z.object({
    email: z.string().email({ message: "Invalid Email" }),
    password: z.string().min(6, "Min 6 Length of Password")
})