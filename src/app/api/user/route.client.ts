export const addUser = async (request: {
  body: {
    user: { firstName: string; email: string };
    volunteerDetails: { ageOver14: boolean };
  };
}) => {
  const { body, ...options } = request;
  const response = await fetch("/api/user", {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
  });

  const json = await response.json();

  return json;
};
