import { Prisma } from "@prisma/client";

export const fetchApi = async (
  endpoint: string,
  method: "POST" | "GET" | "DELETE",
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

export const addUser = async (
  user: Prisma.UserCreateInput,
  volunteerDetails: Prisma.VolunteerDetailsCreateInput
) => fetchApi("/api/user", "POST", { user, volunteerDetails });

export const getUser = async (user: Prisma.UserWhereUniqueInput) => {
  const queryString = new URLSearchParams(
    user as Record<string, string>
  ).toString();
  const url = `/api/user?${queryString}`;
  return fetchApi(url, "GET");
};

export const deleteUser = async (user: Prisma.UserWhereUniqueInput) => {
  const queryString = new URLSearchParams(
    user as Record<string, string>
  ).toString();
  const url = `/api/user?${queryString}`;
  return fetchApi(url, "DELETE");
};
