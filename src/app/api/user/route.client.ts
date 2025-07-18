import { Role, User, VolunteerDetails } from "@prisma/client";

type CreateUserInput = Omit<
  User,
  "id" | "events" | "eventIds" | "organizationId"
>;
type CreateVolunteerDetailsInput = Omit<
  VolunteerDetails,
  "id" | "user" | "userId"
>;
type UserUpdateInput = Omit<User, "volunteerDetails" | "volunteerSessions"> & {
  organizationName?: string;
};

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

export const addUser = async (
  user: CreateUserInput,
  volunteerDetails: CreateVolunteerDetailsInput
) => fetchApi("/api/user", "POST", { user, volunteerDetails });

export const getUser = async (userID: string) => {
  const url = `/api/user?id=${userID}`;
  return fetchApi(url, "GET");
};

export const getUserByEmail = async (email: string) => {
  const url = `/api/user?email=${email}`;
  return fetchApi(url, "GET");
};

export const getUsersByRole = async (role: Role) => {
  const url = `/api/user?role=${role}`;
  return fetchApi(url, "GET");
};

export const getUsersByDate = async (date: Date) => {
  const isoDate = date.toISOString().split("T")[0];
  const url = `/api/user?date=${isoDate}`;
  return fetchApi(url, "GET");
};

export const deleteUser = async (userID: string) => {
  const url = `/api/user?id=${userID}`;
  return fetchApi(url, "DELETE");
};

export const updateUser = async (
  user: UserUpdateInput,
  volunteerDetails?: VolunteerDetails
) => {
  return fetchApi("/api/user", "PATCH", { user, volunteerDetails });
};
