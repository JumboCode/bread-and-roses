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
  if (!response.ok) {
    throw new Error('API Error: $(response.statusText)');
  }

  return response.json();
};

export const addEvent = async (event: CreateEventInput) => {
  fetchApi("/api/event", "POST", { event });
};

export const getEvent = async (eventID: string) => {
  const url = `/api/event?id=${eventID}`;
  return fetchApi(url, "GET");
};

export const updateEvent = async (event: Event) => {
  return fetchApi("/api/event", "PATCH", { event });
};

export const deleteEvent = async (id: string) => {
  const response = await fetch("/api/event", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  const json = await response.json();

  return json;
};

// NOTE:  Fetches all events
export const fetchEvent = async () => {
  const response = await fetch("/api/event", {
    method: "GET",
  });

  const json = await response.json();

  return json;
};
