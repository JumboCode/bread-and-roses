import { Event } from "@prisma/client";

type CreateEventInput = Pick<
  Event,
  "eventName" | "description" | "maxPeople" | "dateTime"
>;

export const addEvent = async (event: CreateEventInput) => {
  const response = await fetch("/api/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event }),
  });

  const json = await response.json();

  return json;
};

export const updateEvent = async (event: Event) => {
  const response = await fetch("/api/event", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event }),
  });

  const json = await response.json();

  return json;
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

// NOTE: This is for fetching all events
export const fetchEvent = async () => {
  const response = await fetch("/api/event", {
    method: "GET",
  });

  const json = await response.json();

  return json;
};
