import { PrismaClient, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    const { text, subject, attachments } = await request.json();

    const users = await prisma.user.findMany({
      where: { role: Role.VOLUNTEER },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        type: "OAuth2",
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENTSECRET,
        refreshToken: process.env.OAUTH_REFRESHTOKEN,
        accessToken: process.env.OAUTH_ACCESSTOKEN,
      },
    });

    for (const attachment of attachments) {
      attachment.content = Buffer.from(attachment.content.data);
    }

    const massMessage = {
      from: process.env.NODEMAILER_EMAIL,
      bcc: users.map((x) => x.email),
      subject: subject,
      text: text,
      html: `${text}`,
      attachments: attachments,
    };

    await transporter.sendMail(massMessage);

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: "Mass email sent with text: " + text,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        code: "ERROR",
        message: error,
      },
      { status: 500 }
    );
  }
};
