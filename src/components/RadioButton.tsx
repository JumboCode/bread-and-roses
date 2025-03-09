import React from "react";

type RadioButtonProps = {
  label: string;
  checked: boolean;
  onChange?: () => void;
};

const RadioButton = ({ label, checked, onChange }: RadioButtonProps) => {
  return (
    <div
      className={`w-[332px] h-[42px] inline-flex justify-between items-start ${
        onChange ? "cursor-pointer" : ""
      }`}
      onClick={onChange}
    >
      <div className="flex items-center gap-2">
        <div className="w-[42px] h-[42px] flex items-center justify-center">
          {checked ? (
            <svg
              width="42"
              height="42"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_yes)">
                <path
                  d="M21 16C18.24 16 16 18.24 16 21C16 23.76 18.24 26 21 26C23.76 26 26 23.76 26 21C26 18.24 23.76 16 21 16ZM21 11C15.48 11 11 15.48 11 21C11 26.52 15.48 31 21 31C26.52 31 31 26.52 31 21C31 15.48 26.52 11 21 11ZM21 29C16.58 29 13 25.42 13 21C13 16.58 16.58 13 21 13C25.42 13 29 16.58 29 21C29 25.42 25.42 29 21 29Z"
                  fill="#1976D2"
                />
              </g>
              <defs>
                <clipPath id="clip0_yes">
                  <rect width="42" height="42" fill="white" />
                </clipPath>
              </defs>
            </svg>
          ) : (
            <svg
              width="42"
              height="42"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_no)">
                <path
                  d="M21 11C15.48 11 11 15.48 11 21C11 26.52 15.48 31 21 31C26.52 31 31 26.52 31 21C31 15.48 26.52 11 21 11ZM21 29C16.58 29 13 25.42 13 21C13 16.58 16.58 13 21 13C25.42 13 29 16.58 29 21C29 25.42 25.42 29 21 29Z"
                  fill="black"
                  fillOpacity="0.6"
                />
              </g>
              <defs>
                <clipPath id="clip0_no">
                  <rect width="42" height="42" fill="white" />
                </clipPath>
              </defs>
            </svg>
          )}
        </div>
        <div className="inline-flex flex-col items-start">
          <div
            className="text-[#344054] text-[16px] font-['Sofia Pro'] font-normal leading-6"
            style={{ wordWrap: "break-word" }}
          >
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioButton;
