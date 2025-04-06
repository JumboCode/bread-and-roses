"use client";

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import React, { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Icon } from "@iconify/react/dist/iconify.js";
import { InputAdornment } from '@mui/material';
import { Calendar } from "@components/Calendar";
import "react-day-picker/style.css";

const GroupSignUpModal = () => {
    const [showModal, setShowModal] = useState(true);
    const [showCalendar, setShowCalendar] = useState(false);
    const buttonRef = useRef(null);
    const calendarRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // if user clicks outside the calendar, close it
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        }
        if (showCalendar) {
            document.addEventListener("mousedown", handleClickOutside);
        };
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showCalendar]);

    if (!showModal) return null;

    return (
        <div className="border border-gray-300 w-[596px] h-[867.03px] shadow-md rounded-xl place-content-center">
            <div className="bg-white border border-gray-300 w-[596px] h-[867px] shadow-md rounded-xl p-6 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl text-gray-500">Add event title</h2>
                    {/* Close Button (optional) */}
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setShowModal(false)}
                    >
                        <HighlightOffIcon className="h-10 w-10" />
                    </button>
                </div>
                <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 dark:bg-gray/400" />

                <label className="block text-sm font-medium mt-2 mb-2 flex flex-row gap-[6px] items-center">
                    <Icon icon={"lets-icons:time-atack"} width="20"/>
                    Time
                </label> 
                <div ref={calendarRef} className="flex flex-row w-full gap-[15px] mb-4">
                <TextField
                    className="border border-gray-300 rounded-md px-3 py-2 w-[700px] mb-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="MM/DD/YYYY"
                    variant="outlined"
                    label="Select Date"
                    autoComplete='off'
                    size='small'
                    onFocus={() => setShowCalendar(!showCalendar)}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <button
                                        ref={buttonRef}
                                        onClick={() => setShowCalendar(!showCalendar)}
                                    >
                                        <Icon icon={"mdi:calendar"} width="25"/>
                                    </button>
                                </InputAdornment>
                            )
                        }
                    }}
                />
                {showCalendar && (
                    <div
                        style={{
                            position: "absolute",
                            top: "calc(100% - 630px)",
                            left: "20px", 
                            zIndex: 10,
                            backgroundColor: "white",
                            borderRadius: "20px",
                            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        }}>
                        <Calendar/>
                    </div>
                )}
                <TextField
                    label="Start time"
                    variant="outlined"
                    autoComplete='off'
                    size='small'
                />
                <TextField
                    label="End time"
                    variant="outlined"
                    autoComplete='off'
                    size='small'
                />
                </div>

                <label className="block text-sm font-medium mt-2 mb-2 flex flex-row gap-[6px] items-center">
                    <Icon icon={"material-symbols:group"} width="20"/>
                    Name of group
                </label>
                <input
                    type="text"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full mb-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <label className="block text-sm font-medium mt-2 mb-2 flex flex-row gap-[6px] items-center">
                    <Icon icon={"basil:document-solid"} width="20"/>
                    Group description
                </label>
                <textarea
                    className="border border-gray-300 rounded-md px-3 py-2 w-full mb-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows="5"
                ></textarea>
            
                <label className="block text-sm font-medium mt-2 mb-2 flex flex-row gap-[6px] items-center">
                    <Icon icon={"material-symbols:group-add"} width="20"/>
                    Reason(s) for group signup
                </label>
                <textarea
                    className="border border-gray-300 rounded-md px-3 py-2 w-full mb-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows="5"
                ></textarea>

                <label className="block text-sm font-medium mb-1 flex flex-row gap-[6px] items-center">
                    <Icon icon={"material-symbols:groups"} width="20"/>
                    Capacity
                </label>
                <input
                    type="text"
                    className="border border-gray-300 rounded-md px-3 py-2 w-[46px] h-[36px] mb-6 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <div className="mb-[20px] flex flex-row justify-end">
                    <button
                        className="bg-teal-600 w-[67px] h-[40px] p-2.5 px-3 text-white rounded-md font-semibold"
                    >
                        Send
                    </button>
                </div>

            </div>
            
        </div>
    );
};

export default GroupSignUpModal;