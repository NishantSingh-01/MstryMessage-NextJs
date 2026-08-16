import resend from '@/lib/resend'
import { EmailTemplate } from '@/helper/verificationEmail'
import { ApiResponse } from '@/types/apiResponse'


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string): Promise<ApiResponse> {

    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mstry Message | Verification Code',
            react: EmailTemplate({ firstName: username, otp: verifyCode }),
        })

        return { success: true, message: "Verification email sent successfully" }
    } catch (emailError) {
        console.log("Error at email Sending", emailError)
        return { success: false, message: "Failed to send email Verification code" }
    }

}