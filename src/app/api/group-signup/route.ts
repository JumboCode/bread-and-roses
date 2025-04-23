import { NextRequest, NextResponse } from "next/server";
import { sendGroupSignupMail } from "../../../lib/groupSignupMail"; // or use relative if alias doesn't work

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Group Signup Payload:", body);

    await sendGroupSignupMail(body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mailer error:", error);
    return NextResponse.json(
      { error: "Failed to send group signup email" },
      { status: 500 }
    );
  }
}
