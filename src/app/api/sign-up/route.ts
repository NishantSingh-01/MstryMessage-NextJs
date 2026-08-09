import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/user.model"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helper/sendVerificationEmail"

import { ApiResponse } from "@/types/apiResponse"
import { SignUpSchema } from "@/schemas/signUpSchema"
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
                    message: "Email Already Exist"
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