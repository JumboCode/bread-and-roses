import { PrismaClient, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    const { text } = await request.json();

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

    const massMessage = {
      from: process.env.NODEMAILER_EMAIL,
      bcc: users.filter((user) => user.lastName === "Kim").map((x) => x.email),
      subject: "Message from Bread & Roses Admin",
      text: text,
      html: `idk what this does`,
    };

    await transporter.sendMail(massMessage);

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
