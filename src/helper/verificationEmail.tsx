import * as React from "react";

interface EmailTemplateProps {
    firstName: string;
    otp: string;
}

export function EmailTemplate({ firstName, otp, }: EmailTemplateProps) {

    return (
        <div
            style={{
                fontFamily: "Arial, sans-serif",
                backgroundColor: "#f4f4f5",
                padding: "40px 20px",
            }}
        >
            <div
                style={{
                    maxWidth: "500px",
                    margin: "0 auto",
                    backgroundColor: "#ffffff",
                    padding: "40px",
                    borderRadius: "12px",
                }}
            >
                <h1 style={{ color: "#111827" }}>
                    Hello, {firstName}! ⚕️〽️
                </h1>

                <p style={{ color: "#4b5563", fontSize: "16px" }}>
                    Use the OTP below to verify your email address:
                </p>

                <div
                    style={{
                        textAlign: "center",
                        margin: "30px 0",
                    }}
                >
                    <span
                        style={{
                            display: "inline-block",
                            backgroundColor: "#f3f4f6",
                            padding: "15px 30px",
                            borderRadius: "8px",
                            fontSize: "32px",
                            fontWeight: "bold",
                            letterSpacing: "8px",
                            color: "#111827",
                        }}
                    >
                        {otp}
                    </span>
                </div>

                <p style={{ color: "#6b7280", fontSize: "14px" }}>
                    This OTP is valid for <strong>10 minutes</strong>.
                </p>

                <p style={{ color: "#6b7280", fontSize: "14px" }}>
                    Do not share this OTP with anyone. If you did not request
                    this code, you can safely ignore this email.
                </p>

                <hr
                    style={{
                        border: "none",
                        borderTop: "1px solid #e5e7eb",
                        margin: "30px 0",
                    }}
                />

                <p
                    style={{
                        color: "#9ca3af",
                        fontSize: "12px",
                        textAlign: "center",
                    }}
                >
                    © RideFlow. All rights reserved.
                </p>
            </div>
        </div>
    );
}