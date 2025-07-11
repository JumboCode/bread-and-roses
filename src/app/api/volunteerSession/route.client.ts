import { VolunteerSession } from "@prisma/client";

type CreateVolunteerSession = Omit<VolunteerSession, "id" | "User">;

/**
 * Sends an HTTP request to the specified endpoint with the provided method and body.
 *
 * @param {string} endpoint - The URL endpoint to which the request will be sent.
 * @param {"POST" | "GET" | "DELETE" | "PUT"} method - The HTTP method for the request.
 * @param {Record<string, any>} [body] - The optional request body, used for POST and PUT requests.
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

export const addVolunteerSession = async (
  volunteerSession: CreateVolunteerSession
) => {
  return fetchApi("/api/volunteerSession", "POST", { volunteerSession });
};

export const updateVolunteerSession = async (params: {
  userId?: string;
  organizationId?: string;
}) => {
  return fetchApi("/api/volunteerSession", "PATCH", params);
};

export const getVolunteerSessions = async (userId: string) => {
  const url = `/api/volunteerSession?userId=${userId}`;
  return fetchApi(url, "GET");
};

export const getAllVolunteerSessions = async () => {
  const url = `/api/volunteerSession`;
  return fetchApi(url, "GET");
};
