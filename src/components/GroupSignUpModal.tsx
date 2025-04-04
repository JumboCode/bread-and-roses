"use client";

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import React, { useState, useRef } from "react";

const GroupSignUpModal = () => {
    const [showModal, setShowModal] = useState(true);

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

                

                <label className="block text-sm font-medium mt-2 mb-2">Name of group</label>
                <input
                    type="text"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full mb-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <label className="block text-sm font-medium mt-2 mb-2">Group description</label>
                <textarea
                    className="border border-gray-300 rounded-md px-3 py-2 w-full mb-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows="5"
                ></textarea>
            
                <label className="block text-sm font-medium mt-2 mb-2">Reason(s) for group signup</label>
                <textarea
                    className="border border-gray-300 rounded-md px-3 py-2 w-full mb-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows="5"
                ></textarea>

                <label className="block text-sm font-medium mb-1">Capacity</label>
                <input
                    type="text"
                    className="border border-gray-300 rounded-md px-3 py-2 w-10 mb-6 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <button
                    className="bg-teal-600 p-2.5 px-3 text-white rounded-md font-semibold"
                >
                    Send
                </button>

            </div>
            
        </div>
    );
};

export default GroupSignUpModal;