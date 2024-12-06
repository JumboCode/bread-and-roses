import nodemailer from "nodemailer";

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
