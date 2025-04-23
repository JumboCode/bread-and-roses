import React, { useEffect, useRef, useState } from "react";
import clear_circle from "../app/icons/clear-circle.svg";
import Image from "next/image";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import TimeSlotFields from "./TimeSlotFields";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField } from "@mui/material";

interface CustomizeEventProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const CustomizeEventModal = (props: CustomizeEventProps) => {
  const { modalVisible, setModalVisible } = props;

  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [timeSlots, setTimeSlots] = React.useState([
    { start: "", end: "", submitted: false },
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setModalVisible(false);
      }
    };

    if (modalVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalVisible, setModalVisible]);

  if (!modalVisible) return null;

  return (
    <div className="absolute left-full ml-4 w-[calc(100vw-240px)] gap-x-2 inset-0 z-50 flex  bg-opacity-40">
      <div
        ref={modalRef}
        className="bg-white rounded-[12px] border w-[596px] h-[503.03px] pt-8 pr-5 pb-8 pl-5 relative space-y-4"
      >
        <div className="flex justify-end">
          <Image
            className="cursor-pointer"
            src={clear_circle}
            width={29}
            height={29}
            alt="clear"
            onClick={() => setModalVisible(false)}
          />
        </div>
        <TextField
          placeholder="Add event title"
          variant="standard"
          fullWidth
          InputProps={{
            style: {
              color: "#000000",
              fontWeight: 600,
            },
            disableUnderline: true,
          }}
          sx={{
            "& input::placeholder": {
              color: "#98A2B3",
              opacity: 1,
              textTransform: "capitalize",
            },
          }}
        />
        <hr
          className="border-t border-gray-300 m-0 p-0"
          style={{ margin: 0 }}
        />
        <div className="flex items-center space-x-2 mb-2">
          <TimelapseIcon />
          <span className="font-sm">Time</span>
        </div>
        <div className="mb-4">
          <div className="flex gap-4">
            <div className="flex items-center gap-4">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  disablePast={true}
                  disableHighlightToday={true}
                  value={selectedDate}
                  onChange={(newDate) => {
                    setSelectedDate(newDate);
                  }}
                  slotProps={{
                    textField: {
                      label: "Select Date",
                      size: "small",
                      InputLabelProps: {
                        shrink: true,
                        sx: {
                          backgroundColor: "white",
                          padding: "0 4px",
                        },
                      },
                      fullWidth: true,
                      placeholder: "MM/DD/YYYY",
                    },
                    field: {
                      autoFocus: true,
                    },
                  }}
                />
              </LocalizationProvider>
              <TimeSlotFields
                timeSlots={timeSlots}
                setTimeSlots={setTimeSlots}
              ></TimeSlotFields>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <DescriptionRoundedIcon />
            <span className="font-sm">Event description (if any)</span>
          </div>
          <textarea
            className="w-full border rounded px-3 py-2"
            style={{
              width: "556px",
              height: "172px",
              borderRadius: "8px",
              paddingRight: "12px",
              paddingLeft: "12px",
              borderWidth: "1px",
              resize: "none",
            }}
            placeholder="Enter description..."
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeEventModal;
