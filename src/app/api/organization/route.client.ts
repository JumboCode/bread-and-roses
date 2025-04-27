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

export const addOrganization = async (
  userId: string,
  organizationName: string
) => {
  return fetchApi("/api/organization", "POST", { userId, organizationName });
};

export const getOrganization = async (organizationId: string) => {
  const url = `/api/organization?id=${organizationId}`;
  return fetchApi(url, "GET");
};

export const getOrganizations = async () => {
  const url = `/api/organization`;
  return fetchApi(url, "GET");
};

export const deleteOrganization = async (organizationId: string) => {
  const url = `/api/organization?id=${organizationId}`;
  return fetchApi(url, "DELETE");
};
