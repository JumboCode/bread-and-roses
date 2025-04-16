import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "./Calendar";

interface CustomizeEventProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const CustomizeEventModal = (props: CustomizeEventProps) => {
  const { modalVisible, setModalVisible } = props;

  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
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
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-black"
          onClick={() => setModalVisible(false)}
        >
          ×
        </button>

        {/* Event Title */}
        <h2 className="text-lg font-semibold mb-4">Add event title</h2>

        {/* Time Section */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            {/* Placeholder for time icon */}
            <div className="w-5 h-5">{/* Icon here */}</div>
            <span className="font-medium">Time</span>
          </div>
          <div className="flex gap-4">
            {/* Calendar selector */}
            <div className="flex-2 flex flex-col">
              <Calendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
            {/* Start and End Time placeholders */}
            {/* <input
              type="text"
              placeholder="Start time"
              className="flex-1 border rounded px-2 py-1"
            />
            <input
              type="text"
              placeholder="End time"
              className="flex-1 border rounded px-2 py-1"
            /> */}
          </div>
        </div>

        {/* Event Description Section */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            {/* Placeholder for description icon */}
            <div className="w-5 h-5">{/* Icon here */}</div>
            <span className="font-medium">Event description (if any)</span>
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
            }}
            placeholder="Enter description..."
          />
        </div>

        {/* Add Button */}
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
