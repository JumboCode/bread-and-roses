import { TimeSlot } from "@prisma/client";

type CreateTimeSlotInput = Omit<TimeSlot, "id" | "user">;

/**
 * Sends an HTTP request to the specified endpoint with the provided method and body.
 *
 * @param {string} endpoint - The URL endpoint to which the request will be sent.
 * @param {"POST" | "GET" | "DELETE" | "PATCH"} method - The HTTP method for the request.
 * @param {Record<string, any>} [body] - The optional request body, used for POST and PATCH requests.
 *
 * @returns {Promise<any>} - Resolves to the response data in JSON format if the request is successful.
 * @throws {Error} - Throws an error if the response status is not OK (status code outside the 200-299 range).
 */
export const fetchApi = async (
  endpoint: string,
  method: "POST" | "GET" | "DELETE" | "PATCH",
  body?: Record<string, unknown>
) => {
  const response = await fetch(endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      JSON.stringify({
        code: responseData.code,
        message: responseData.message,
      })
    );
  }

  return responseData;
};

export const addTimeSlot = async (timeSlot: CreateTimeSlotInput) =>
  fetchApi("/api/timeSlot", "POST", { timeSlot });

export const getTimeSlotsByDate = async (userId: string, date: Date) => {
  const isoDate = date.toISOString().split("T")[0];
  const url = userId
    ? `/api/timeSlot?userId=${userId}&date=${isoDate}`
    : `/api/timeSlot?date=${isoDate}`;

  return fetchApi(url, "GET");
};

export const deleteTimeSlot = async (
  userId: string,
  startTime: Date,
  endTime: Date
) => {
  return fetchApi("/api/timeSlot", "DELETE", { userId, startTime, endTime });
};
