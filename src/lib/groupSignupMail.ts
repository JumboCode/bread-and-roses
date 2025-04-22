import nodemailer from "nodemailer";

export const sendGroupSignupMail = async (fields: {
  eventTitle: string;
  date: string;
  startTime: string;
  endTime: string;
  groupName: string;
  groupDescription?: string;
  groupReason?: string;
  groupCapacity: number;
}) => {
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

  const {
    eventTitle,
    date,
    startTime,
    endTime,
    groupName,
    groupDescription,
    groupReason,
    groupCapacity,
  } = fields;

  const subject = `New Group Sign-Up: ${groupName}`;
  const textBody = `
Group Sign-Up Request

Event Title: ${eventTitle}
Date: ${date}
Start Time: ${startTime}
End Time: ${endTime}
Group Name: ${groupName}
Group Description: ${groupDescription || 'N/A'}
Reason(s): ${groupReason || 'N/A'}
Capacity: ${groupCapacity}
  `;

  const htmlBody = `
    <h2>New Group Sign-Up Request</h2>
    <p><strong>Event Title:</strong> ${eventTitle}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Start Time:</strong> ${startTime}</p>
    <p><strong>End Time:</strong> ${endTime}</p>
    <p><strong>Group Name:</strong> ${groupName}</p>
    <p><strong>Group Description:</strong> ${groupDescription || 'N/A'}</p>
    <p><strong>Reason(s):</strong> ${groupReason || 'N/A'}</p>
    <p><strong>Capacity:</strong> ${groupCapacity}</p>
  `;

  const message = {
    from: process.env.NODEMAILER_EMAIL,
    to: process.env.NODEMAILER_EMAIL,
    subject,
    text: textBody,
    html: htmlBody,
  };

  await transporter.sendMail(message);
};
