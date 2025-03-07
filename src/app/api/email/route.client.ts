import { Attachment } from "nodemailer/lib/mailer";

export const sendMassEmail = async (
  text: string,
  subject: string,
  attachments: Attachment[] | null
) => {
  const response = await fetch("/api/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, subject, attachments }),
  });

  const json = await response.json();

  return json;
};
