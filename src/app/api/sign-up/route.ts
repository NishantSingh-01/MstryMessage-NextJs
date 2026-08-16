import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/user.model"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helper/sendVerificationEmail"
import { NextRequest, NextResponse } from "next/server"




export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, email, password } = await request.json()

        const userExistVerifiedByUsername = await UserModel.findOne({ username, isVerified: true })
        if (userExistVerifiedByUsername) {
            return NextResponse.json({
                success: false,
                message: "Username Already Exist"
            },
                {
                    status: 400
                })

        }
        
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

        const userExistVerifiedByEmail = await UserModel.findOne({ email })
        if (userExistVerifiedByEmail) {
            if (userExistVerifiedByEmail?.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "Email Already Exist, Go to Sign In"
                },
                    {
                        status: 400
                    })
            } else {
                // Handle the case where the email exists but is not verified
                const HashedPassword = await bcrypt.hash(password, 10)
                userExistVerifiedByEmail.password = HashedPassword
                userExistVerifiedByEmail.verifyCode = verificationCode
                userExistVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000)

                await userExistVerifiedByEmail.save()

            }
        } else {
            const HashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setMinutes(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: HashedPassword,
                verifyCode: verificationCode,
                isVerified: false,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                message: []
            })
            await newUser.save()
        }

        //send verification email 
        const emailResponse = await sendVerificationEmail(email, username, verificationCode)
        if (!emailResponse.success) {
            return NextResponse.json({
                success: false,
                message: emailResponse.message
            },
                {
                    status: 500
                })
        }

        return NextResponse.json({
            success: true,
            message: "User Registered Successfully || Verification Email Sent"
        },
            {
                status: 201
            })

    } catch (error) {
        console.log("Error while Registering", error)
        return NextResponse.json({
            success: false,
            message: "Error Registering User"
        },
            {
                status: 500
            })
    }
}

/*
Signing flow summary:
1. Connect to the database.
2. Read username, email, and password from the request body.
3. Check if a verified user already exists with the same username.
   - If yes, return 400 with "Username Already Exist".
4. Generate a 6-digit verification code.
5. Check if the email exists in the database.
   - If the email exists and is verified, return 400 with "Email Already Exist".
   - If the email exists but is not verified, update the password, verification code,
     and expiry on the existing record.
   - If the email does not exist, create a new unverified user record.
6. Send the verification email with the generated code.
   - If email sending fails, return 500 with the email error message.
7. Return 201 with success message when registration and verification email are sent.
8. If any error occurs during the process, return 500 with "Error Registering User".

Flowchart (textual):
START
  -> CONNECT DB
  -> PARSE REQUEST BODY
  -> CHECK USERNAME VERIFIED
      -> YES: RETURN 400 (Username Already Exist)
      -> NO: GENERATE VERIFICATION CODE
  -> CHECK EMAIL
      -> EMAIL VERIFIED: RETURN 400 (Email Already Exist)
      -> EMAIL UNVERIFIED: UPDATE PASSWORD, CODE, EXPIRY
      -> EMAIL NOT FOUND: CREATE NEW USER
  -> SEND VERIFICATION EMAIL
      -> FAIL: RETURN 500
      -> SUCCESS: RETURN 201
END


*/ 