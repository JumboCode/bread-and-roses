import { Event } from "@prisma/client";

type CreateEventInput = Pick<
  Event,
  "EventName" | "Description" | "MaxPeople" | "DateTime"
>;

export const addEvent = async (request: {
  body: { event: CreateEventInput };
}) => {
  const { body, ...options } = request;
  const response = await fetch("/api/event", {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
  });

  const json = await response.json();

  return json;
};

export const updateEvent = async (request: { body: { event: Event } }) => {
  const { body, ...options } = request;
  const response = await fetch("/api/event", {
    method: "PUT",
    body: JSON.stringify(body),
    ...options,
  });

  const json = await response.json();

  return json;
};

export const deleteEvent = async (request: { body: { id: string } }) => {
  const { body, ...options } = request;
  const response = await fetch("/api/event", {
    method: "DELETE",
    body: JSON.stringify(body),
    ...options,
  });

  const json = await response.json();

  return json;
};
