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
  if (body) {
    console.log("body exists", body);
  } else {
    console.log("body does not exist", body);
  }
  
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
  // const response = await fetch("/api/event", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ event }),
  // });

  // const json = await response.json();

  // return json;
  fetchApi("/api/event", "POST", { event });
};

// export const getUser = async (userID: string) => {
//   const url = `/api/user?id=${userID}`;
//   return fetchApi(url, "GET");
// };

export const getEvent = async (eventID: string) => {
  const url = `/api/event?id=${eventID}`;
  // console.log("HERE");
  return fetchApi(url, "GET");
};

export const updateEvent = async (event: Event) => {
  // const response = await fetch("/api/event", {
  //   method: "PATCH",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ event }),
  // });

  // const json = await response.json();

  // return json;
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

// NOTE: This is for fetching all events
export const fetchEvent = async () => {
  const response = await fetch("/api/event", {
    method: "GET",
  });

  const json = await response.json();

  return json;
};
