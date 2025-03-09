"use client";

import Image from "next/image";
import logo1 from "../../public/logo1.png";
import { StaticImageData } from "next/image";

interface ConfirmationProps {
  title: string;
  buttonText: string;
  captionText: string;
  image: StaticImageData;
  onClick: () => void;
}

const CheckConfirmation = ({
  title,
  buttonText,
  captionText,
  image,
  onClick,
}: ConfirmationProps) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col justify-center items-center min-h-screen w-full my-[32px]">
        <Image
          src={logo1}
          alt="Logo"
          height={173}
          width={215}
          className="mb-[24px]"
        />
        <div className="p-6 border border-[#D0D5DD] rounded-[20px] shadow-[0px_8px_8px_-4px_#10182808,_0px_20px_24px_-4px_#10182814] flex justify-center items-start pt-6 w-1/2">
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center text-center">
              <div
                style={{
                  color: "#9A0F28",
                  fontSize: "36px",
                  fontWeight: 600,
                  fontFamily: "Kepler Std",
                }}
              >
                {title}
              </div>
              <div className="text-[#667085] text-[16px] font-normal mb-[10px]">
                {captionText}
              </div>
            </div>
            <hr className="w-full border-t border-[#D0D5DD] mb-[20px]" />

            <Image src={image} alt="Confirmation" width={284} height={249} />
            <button
              className="bg-[#138D8A] mt-[32px] text-white text-[16px] py-[10px] px-[18px] rounded-[8px] w-full text-center font-semibold"
              type="submit"
              onClick={onClick}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckConfirmation;
