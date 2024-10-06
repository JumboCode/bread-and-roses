export const addUser = async (request: {
  body: { user: { firstName: string; lastName: string; email: string } };
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
