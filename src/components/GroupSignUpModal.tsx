"use client";

import React, { useState, useRef, useEffect } from "react";
import { format } from 'date-fns';
import TextField from "@mui/material/TextField";
import { Icon } from "@iconify/react/dist/iconify.js";
import { InputAdornment } from '@mui/material';
import { Calendar } from "@components/Calendar";
import "react-day-picker/style.css";

const GroupSignUpModal = ({ onClose }: { onClose: () => void }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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
        // <div className="border border-gray-300 w-[596px] h-[867.03px] shadow-md rounded-xl place-content-center">
            <div className="bg-white border border-gray-300 w-[596px] h-[867px] shadow-md rounded-xl p-6 relative gap-[14px] flex flex-col text-gray-700">
                {/* Header */}
                <div className="flex items-center justify-end">
                    {/* Close Button (optional) */}
                    <button
                        className="text-[#101828] hover:text-gray-700 rounded-full"
                        onClick={onClose}
                    >
                        <Icon icon={"icon-park-solid:close-one"} width="25" />
                    </button> 
                </div>
                <TextField 
                    placeholder="Add event title"
                    variant="standard"
                    fullWidth
                    autoComplete="off"
                    slotProps={{
                        input: {
                            sx: {
                                fontSize: 18,
                                fontWeight: 600,
                                color: "#6B7280",
                                padding: 0,
                            },
                        },
                        root: {
                            sx: {
                                '&::before': {
                                  borderBottom: '1px solid #D0D5DD',
                                },  
                            },
                        },
                    }}
                />

                <label className="block text-sm font-medium flex flex-row gap-[6px] items-center">
                    <Icon icon={"lets-icons:time-atack"} width="20"/>
                    Time
                </label> 
                <div ref={calendarRef} className="flex flex-row w-full gap-[15px]">
                <TextField
                    className="border border-gray-300 rounded-md px-3 py-2 w-[700px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="MM/DD/YYYY"
                    variant="outlined"
                    label="Select Date"
                    autoComplete='off'
                    size='small'
                    onFocus={() => setShowCalendar(!showCalendar)}
                    value={selectedDate ? format(selectedDate, "MM/dd/yyyy") : ""}
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
                        },
                        inputLabel: {
                            shrink: true,
                        }
                    }}
                />
                {showCalendar && (
                    <div
                        style={{
                            position: "absolute",
                            top: "calc(100% - 670px)",
                            left: "20px", 
                            zIndex: 10,
                            backgroundColor: "white",
                            borderRadius: "20px",
                            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        }}>
                        <Calendar
                            selected={selectedDate ?? undefined}
                            onSelect={(date) => {
                            if (date) {
                                setSelectedDate(date);
                                setShowCalendar(false);
                            }
                            }}
                        />
                    </div>
                )}
                <TextField
                    label="Start time"
                    variant="outlined"
                    autoComplete='off'
                    size='small'
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        }
                    }}
                />
                <TextField
                    label="End time"
                    variant="outlined"
                    autoComplete='off'
                    size='small'
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        }
                    }}
                />
                </div>

                <label className="block text-sm font-medium  flex flex-row gap-[6px] items-center">
                    <Icon icon={"material-symbols:group"} width="20"/>
                    Name of group
                </label>
                {/* <input
                    type="text"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                /> */}
                <TextField
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                    fullWidth
                />

                <label className="block text-sm font-medium flex flex-row gap-[6px] items-center">
                    <Icon icon={"basil:document-solid"} width="20"/>
                    Group description
                </label>
                {/* <textarea
                    className="border border-gray-300 rounded-md px-3 py-2 w-full mb-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows="5"
                ></textarea> */}
                <TextField
                    // className="border border-gray-300 rounded-md px-3 py-2 w-full mb-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                    fullWidth
                    multiline
                    rows={6}
                />
            
                <label className="block text-sm font-medium flex flex-row gap-[6px] items-center">
                    <Icon icon={"material-symbols:group-add"} width="20"/>
                    Reason(s) for group signup
                </label>
                {/* <textarea
                    className="border border-gray-300 rounded-md px-3 py-2 w-full mb-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows="5"
                ></textarea> */}
                <TextField
                    // className="border border-gray-300 rounded-md px-3 py-2 w-full mb-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                    fullWidth
                    multiline
                    rows={6}
                />

                <label className="block text-sm font-medium flex flex-row gap-[6px] items-center">
                    <Icon icon={"material-symbols:groups"} width="20"/>
                    Capacity
                </label>
                {/* <input
                    type="text"
                    className="border border-gray-300 rounded-md px-3 py-2 w-[46px] h-[36px] mb-6 focus:outline-none focus:ring-1 focus:ring-blue-500"
                /> */}
                <TextField
                    className="w-[46px]"
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                />

                <div className="flex flex-row justify-end mt-4">
                    <button
                        className="bg-teal-600 text-[14px] w-[67px] h-[40px] py-[10px] px-[16px] text-white rounded-lg font-semibold flex justify-center items-center"
                    >
                        Send
                    </button>
                </div>

            </div>
            
        // </div>
    );
};

export default GroupSignUpModal;