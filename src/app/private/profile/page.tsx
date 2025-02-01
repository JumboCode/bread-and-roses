import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import UserAvatar from "@components/UserAvatar";


export default function ProfilePage() {
  return (
    <div>
      {/* Top Bar with profile image, name, email and edit button */}
      <div className="ml-8 flex items-start relative">
        <div className="flex flex-col w-[1094px] p-[24px] px-[28px] items-start gap-[16px] rounded-tr-[8px] rounded-br-[8px] relative">
              <div className="pr-[32px] text-[#101828] text-lg font-bold font-['Sofia Pro'] leading-normal break-words">
              </div>
              <div className="text-[#344054] text-base font-normal font-['Sofia Pro'] leading-normal break-words">
              </div>
              <div className="absolute top-6 left-32 text-lg">
                Won Kim
              </div>
              <div className="absolute top-12 left-32 text-lg">
                won.kim@tufts.edu
              </div>
              <div className="absolute left-10 w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                <UserAvatar firstName="Won" lastName="Kim" />
              </div>
              {/* Close Icon positioned in the top-right corner */}
              <div className="absolute top-6 right-7">
              <div className="flex gap-x-2 font-semibold bg-teal-600 p-2.5 px-3 text-white rounded-md items-center">
                  <Icon icon="ic:round-edit" width="24" height="20" />
                    Edit
              </div>
          </div>
        </div>
      </div>
      {/* Next Part of page with main stuff */}
      <div className="ml-8 flex items-start relative mt-8">
        <div className="flex flex-col w-[1094px] p-[24px] px-[28px] items-start gap-[16px] rounded-tr-[8px] rounded-br-[8px] relative">
            {/* Password */}
            <div>
              <div className="pr-[32px] text-[#101828] text-lg font-bold font-['Sofia Pro'] leading-normal break-words">
                Password *
              </div>
              <div className="absolute top-4 right-4">
                <box className="w-[736px] font-['Sofia Pro'] bg-grey-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Password" required>Password</box>
                <hr class="h-px my-0.1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
              </div>
            </div>
            <br></br>
            {/* 14 */}
            <div>
              <div className="pr-[32px] text-[#101828] text-lg font-bold font-['Sofia Pro'] leading-normal break-words">
                Are you over 14? *
              </div>
              <div className="pr-[32px] text-[#667085] text-sm font-['Sofia Pro'] leading-normal break-words">
                Note: we require volunteers to be over 14 years old to work with us.
              </div>
              <div className="absolute top-32 right-96 flex items-center ps-4 rounded-sm pr-20">
                <input id="bordered-radio-1" type="radio" value="" name="bordered-radio" className ="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500"/>
                <label for="bordered-radio-1" class="text-[#344054] w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
              </div>
              <div className="absolute top-32 right-64 flex items-center ps-4 rounded-sm">
                <input id="bordered-radio-2" type="radio" value="" name="bordered-radio" className = "w-4 h-4 text-blue-600 bg-gray-100 focus:ring-2"/>
                <label for="bordered-radio-2" class="text-[#344054] w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
              </div>
            </div>

            <br></br>

            {/* Volunteering */}
            <div>
              <div className="pr-[32px] text-[#101828] text-lg font-bold font-['Sofia Pro'] leading-normal break-words">
                Is this your first time volunteering with us? *
              </div>
              <div className="absolute top-52 right-96 flex items-center ps-4 rounded-sm pr-20">
                <input id="bordered-radio-3" type="radio" value="" name="bordered-radio2" className ="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500"/>
                <label for="bordered-radio-3" class="text-[#344054] w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
              </div>
              <div className="absolute top-52 right-64 flex items-center ps-4 rounded-sm">
                <input id="bordered-radio-4" type="radio" value="" name="bordered-radio2" className = "w-4 h-4 text-blue-600 bg-gray-100 focus:ring-2"/>
                <label for="bordered-radio-4" class="text-[#344054] w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
              </div>
            </div>
            

            <br></br>
            
            <div className="">
              {/* Title */}
              <div className="text-[#101828] text-lg font-bold leading-normal ">
                Address *
              </div>

              {/* Address Information */}
              <div className="flex flex-col space-y-4 px-64">
                {/* Address Line 1 */}
                <div>
                  <div className="w-[736px] bg-gray-50 text-gray-900 text-sm p-2.5">
                    Joyce Cummings Center
                  </div>
                  <hr class="h-px my-0.1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                </div>

                <div className="flex space-x-4">
                  {/* State */}
                  <div className="w-1/2">
                    <div className="w-[736px] bg-gray-50 text-gray-900 text-sm p-2.5">
                      Medford
                    </div>
                    <hr class="h-px my-0.1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                  </div>

                  {/* Zip Code */}
                  <div className="w-1/2">
                    <div className="w-[26px] bg-gray-50 text-gray-900 text-sm p-2.5">
                      MA
                    </div>
                    <hr class="h-px my-0.1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                  </div>
                </div>

                {/* State and Zip */}
                <div className="flex space-x-4">
                  {/* State */}
                  <div className="w-1/2">
                    <div className="w-[736px] bg-gray-50 text-gray-900 text-sm p-2.5">
                      MA
                    </div>
                    <hr class="h-px my-0.1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                  </div>

                  {/* Zip Code */}
                  <div className="w-1/2">
                    <div className="w-[26px] bg-gray-50 text-gray-900 text-sm p-2.5">
                      United States of America
                    </div>
                    <hr class="h-px my-0.1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                  </div>
                </div>
              </div>
            </div>

            
            
            <br></br>
            <div>
              <div className="pr-[32px] text-[#101828] text-lg font-bold font-['Sofia Pro'] leading-normal break-words">
                Do you have a driver's license? 
              </div>
              <div className="absolute top-90 right-96 flex items-center ps-4 rounded-sm pr-20">
                <input id="bordered-radio-3" type="radio" value="" name="bordered-radio3" className ="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500"/>
                <label for="bordered-radio-3" class="text-[#344054] w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
              </div>
              <div className="absolute top-90 right-64 flex items-center ps-4 rounded-sm">
                <input id="bordered-radio-4" type="radio" value="" name="bordered-radio3" className = "w-4 h-4 text-blue-600 bg-gray-100 focus:ring-2"/>
                <label for="bordered-radio-4" class="text-[#344054] w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
              </div>
            </div>
            

            <br></br>
            
            <div>
              <div className="pr-[32px] text-[#101828] text-lg font-bold font-['Sofia Pro'] leading-normal break-words">
                Do you speak Spanish?
              </div>
              <div className="absolute top-125 right-96 flex items-center ps-4 rounded-sm pr-20">
                <input id="bordered-radio-3" type="radio" value="" name="bordered-radio4" className ="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500"/>
                <label for="bordered-radio-3" class="text-[#344054] w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</label>
              </div>
              <div className="absolute top-125 right-64 flex items-center ps-4 rounded-sm">
                <input id="bordered-radio-4" type="radio" value="" name="bordered-radio4" className = "w-4 h-4 text-blue-600 bg-gray-100 focus:ring-2"/>
                <label for="bordered-radio-4" class="text-[#344054] w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">No</label>
              </div>
            </div>
            
            
            <br></br>
            
            <div>
              <div className="pr-[32px] text-[#101828] text-lg font-bold font-['Sofia Pro'] leading-normal break-words">
              Why do you want to volunteer with us?
              </div>
              <div className="absolute top-200 right-200">
                <box className="w-[400px] font-['Sofia Pro'] bg-grey-50 text-gray-900 text-sm p-2.5" placeholder="Reason" required>I really like Bread and I really like Roses!</box>
                <hr className="h-px my-0.1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
              </div>
            </div>
            
            
            <br></br>
            
            <div>
              <div className="pr-[32px] text-[#101828] text-lg font-bold font-['Sofia Pro'] leading-normal break-words">
                Do you have any other questions or comments?
              </div>
              <div className="absolute top-250 right-250">
                <box className="w-[400px] font-['Sofia Pro'] bg-grey-50 text-gray-900 text-sm p-2.5" placeholder="Questions" required>n/a</box>
                <hr className="h-px my-0.1 bg-gray-200 border-0 dark:bg-gray-700"></hr>
              </div>
            </div>
            
              
        </div>
      </div>  
    </div>
  );
}
