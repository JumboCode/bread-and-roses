import { Prisma, User, VolunteerDetails } from "@prisma/client";

export const fetchApi = async (
  endpoint: string,
  method: "POST" | "GET" | "DELETE" | "PUT",
  body?: Record<string, any>
) => {
  console.log(method);
  const response = await fetch(endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("API Error: $(response.statusText)");
  }

  return response.json();
};

export const addUser = async (user: User, volunteerDetails: VolunteerDetails) =>
  fetchApi("/api/user", "POST", { user, volunteerDetails });

export const getUser = async (userID: string) => {
  const queryString = new URLSearchParams(
    userID as Record<string, string>
  ).toString();
  const url = `/api/user?id=${queryString}`;
  return fetchApi(url, "GET");
};

export const deleteUser = async (userID: string) => {
  
  const queryString = new URLSearchParams(
    userID as Record<string, string>
  ).toString();
  const url = `/api/user?id=${queryString}`;
  return fetchApi(url, "DELETE");
};

export const updateUser = async (
  user: User,
  volunteerDetails: VolunteerDetails
) => fetchApi("/api/user", "PUT", { user, volunteerDetails });
