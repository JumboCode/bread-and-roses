export const fetchApi = async (
  endpoint: string,
  method: "POST",
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

export const addOrganization = async (userId: string, organizationName: string) => {
  return fetchApi("/api/organization", "POST", { userId, organizationName });
};

// export const getOrganization = async (OrganizationID: string) => {
//   const url = `/api/Organization?id=${OrganizationID}`;
//   return fetchApi(url, "GET");
// };

// export const getAllOrganizations = async () => {
//   return fetchApi("/api/Organization", "GET");
// };

// export const updateOrganization = async (organization: Organization) => {
//   return fetchApi("/api/organization", "PATCH", { organization });
// };
