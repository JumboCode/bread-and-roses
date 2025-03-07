"use client";

import React, { useEffect, useState, useRef } from "react";
// import Image from "next/image";
import { sendMassEmail } from "@api/email/route.client";
import useApiThrottle from "../../../hooks/useApiThrottle";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { Attachment } from "nodemailer/lib/mailer";

export default function CommunicationPage() {
  const [subject, setSubject] = React.useState("");
  const [fromEmail] = React.useState("breadandrosesjc@gmail.com");
  const [text, setText] = React.useState("");

  const { fetching: sendMassEmailLoading, fn: throttledSendMassEmail } =
    useApiThrottle({ fn: sendMassEmail });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [attachments, setAttachments] = useState<File[] | null>(null);
  const [preview, setPreview] = useState<string[]>([""]); //TODO: change ts

  const handleButtonClick = () => {
    if (fileInputRef.current !== null) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setAttachments(attachments ? [...attachments, ...fileArray] : fileArray);
      event.target.value = "";
    }
  };

  const formatFileSize = (bytes: number, decimals = 0) => {
    if (!bytes) {
      return "0 bytes";
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["bytes", "kb", "mb", "gb", "tb", "pb", "eb", "zb", "yb"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) +
      (i === 0 ? " " : "") +
      sizes[i]
    );
  };

  useEffect(() => {
    if (!attachments) {
      setPreview([""]);
      return;
    }
    const objectUrls: string[] = attachments.map((currFile) =>
      URL.createObjectURL(currFile)
    );

    setPreview(objectUrls);

    // Cleanup function to free memory
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [attachments]);

  async function fileToNodemailerAttachment(file: File): Promise<Attachment> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return {
      filename: file.name,
      content: buffer,
    };
  }

  async function convertFilesToNodemailerAttachment(
    files: File[] | null
  ): Promise<Attachment[]> {
    const nodeMailerAttachments: Attachment[] = [];
    if (!files) {
      return nodeMailerAttachments;
    }
    for (const file of files) {
      const nodeMailerAttachment = await fileToNodemailerAttachment(file);
      nodeMailerAttachments.push(nodeMailerAttachment);
    }
    return nodeMailerAttachments;
  }

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex items-center gap-3 text-4xl font-['Kepler_Std'] font-semibold">
        <GroupRoundedIcon sx={{ width: 44, height: 44 }}></GroupRoundedIcon>
        Send Email To Volunteers
      </div>
      <div className="flex items-start">
        <div className="w-1/3">
          <p className="font-semibold">Subject</p>
        </div>
        <div className="w-2/3">
          <input
            type="text"
            placeholder="ex: Welcome to Bread & Roses!"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-start">
        <div className="w-1/3">
          <p className="font-semibold">Email From</p>
          <p className="text-gray-500">This is the default email.</p>
        </div>
        <div className="w-2/3">
          <input
            type="text"
            disabled
            className="border border-gray-300 rounded-md p-2 w-full bg-gray-100 text-gray-600 cursor-not-allowed"
            value={fromEmail}
          />
        </div>
      </div>

      <div className="flex items-start">
        <div className="w-1/3">
          <p className="font-semibold">Email Body</p>
          <p className="text-gray-500">
            This will be sent to all volunteers on the site.
          </p>
        </div>
        <div className="w-2/3 flex flex-col gap-6">
          <button
            onClick={handleButtonClick}
            disabled={sendMassEmailLoading}
            className="border-2 border-gray-300 rounded-md p-4 text-center text-gray-500 cursor-pointer hover:border-teal-600"
          >
            <FileUploadRoundedIcon sx={{ color: "#138D8A" }} />
            <p>
              <span className="text-teal-600 font-semibold">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            {/* <p>SVG, PNG, JPG or GIF (max. 3MB)</p> */}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          {/* {attachments?.length && (
            <p className="text-gray-700">
              Selected: {attachments.map((file) => file.name).join(", ")}
            </p>
          )} */}

          {(attachments?.length ?? 0) > 0 &&
            attachments?.map((src, index) => (
              <div className="p-4 gap-4 flex flex-row items-center w-full">
                <UploadFileIcon sx={{ color: "#138D8A" }} />
                <div className="flex flex-col">
                  <div>{src.name}</div>
                  <div className="text-gray-500 flex flex-row gap-2">
                    <div>{formatFileSize(src.size)}</div>
                    <div>•</div>
                    {/* TODO: Actually see if its Complete */}
                    <div>Complete</div>
                  </div>
                </div>
                <DeleteIcon
                  onClick={() =>
                    setAttachments(
                      (prev) => prev?.filter((_, i) => i !== index) || []
                    )
                  }
                  className="ml-auto"
                />
              </div>
            ))}

          {/* {preview.length > 0 &&
            preview.map((src, index) => (
              <img key={index} src={src} alt="OKAY" />
            ))} */}

          <textarea
            className="border border-gray-300 rounded-md p-2 w-full resize-none"
            placeholder="Type your email content"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-start">
        <div className="w-1/3"></div>
        <div className="w-2/3">
          <button
            className="w-[150px] font-semibold bg-teal-600 p-2.5 px-3 text-white rounded-md items-center"
            disabled={sendMassEmailLoading}
            onClick={async () => {
              // TODO: See if we have to throttle conversion
              const nodeMailerAttachments =
                await convertFilesToNodemailerAttachment(attachments);
              // TODO: FIX TO INCLUDE SUBJECT AND BODY, ETC
              await throttledSendMassEmail(
                text,
                subject,
                nodeMailerAttachments
              );
            }}
          >
            Send Email
          </button>
        </div>
      </div>

      {/* <div className="text-center">
        <div className="relative w-full h-[50vh]">
          <Image
            src="/empty_list.png"
            alt="Empty List"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="text-[#344054] font-['Kepler_Std'] text-3xl font-semibold mt-8">
          Coming Soon!
        </div>
      </div> */}
    </div>
  );
}
