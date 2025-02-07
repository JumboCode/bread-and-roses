import nodemailer from "nodemailer";
import { User } from "@prisma/client";

export const sendMail = async (email: string, code: string) => {
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

  const message = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Your Password Reset Code",
    text: `Your password reset code ${code}. This will expire in 60 seconds`,
    html: `<p>Your password reset code is: <strong>${code}</strong></p>`,
  };

  await transporter.sendMail(message);
};

// export const sendMassMail = async (users: User[], text: string) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.NODEMAILER_EMAIL,
//       type: "OAuth2",
//       clientId: process.env.OAUTH_CLIENTID,
//       clientSecret: process.env.OAUTH_CLIENTSECRET,
//       refreshToken: process.env.OAUTH_REFRESHTOKEN,
//       accessToken: process.env.OAUTH_ACCESSTOKEN,
//     },
//   });

//   const massMessage = {
//     from: process.env.NODEMAILER_EMAIL,
//     to: email,
//     subject: "Message from Bread & Roses Admin",
//     text: text,
//     html: `idk what this does`,
//   };

//   await transporter.sendMail(massMessage);
// };
