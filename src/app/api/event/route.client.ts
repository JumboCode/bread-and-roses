import { Event } from "@prisma/client";

type CreateEventInput = Pick<
  Event,
  "eventName" | "description" | "maxPeople" | "dateTime"
>;

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

export const addEvent = async (event: CreateEventInput) => {
  fetchApi("/api/event", "POST", { event });
};

export const getEvent = async (eventID: string) => {
  const url = `/api/event?id=${eventID}`;
  return fetchApi(url, "GET");
};

export const getAllEvents = async () => {
  return fetchApi("/api/event", "GET");
};

export const updateEvent = async (event: Event) => {
  return fetchApi("/api/event", "PATCH", { event });
};

export const deleteEvent = async (eventID: string) => {
  const url = `/api/user?id=${eventID}`;
  return fetchApi(url, "DELETE");
};
