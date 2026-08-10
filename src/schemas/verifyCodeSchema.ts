import { z } from 'zod'


export const verifyCodeSchema = z.object({
    code: z.string()
        .min(6, "Code must be at least 6 characters")
        
})
