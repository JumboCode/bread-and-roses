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
      tls: {
        rejectUnauthorized: false,
      }, //@TODO: REmove before deployment
    });

    console.log("before mass message");

    console.log(attachments);

    const massMessage = {
      from: process.env.NODEMAILER_EMAIL,
      //@TODO: CHANGE TS BEFORE DEPLOYMENT
      bcc: users.filter((user) => user.lastName === "Kim").map((x) => x.email),
      subject: subject,
      text: text,
      html: `${text}`, //@TODO: ACTUALLY DO TS
      attachments: attachments,
    };

    await transporter.sendMail(massMessage);

    console.log("after transporter");

    return NextResponse.json({
      code: "SUCCESS",
      message: "Mass email sent with text: " + text,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      code: "ERROR",
      message: error,
    });
  }
};
