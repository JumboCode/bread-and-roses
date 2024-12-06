export const sendForgotCode = async (email: string) => {
  const response = await fetch("/api/password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const json = await response.json();

  return json;
};

export const updatePassword = async (email: string, password: string) => {
  const response = await fetch("/api/password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json();

  return json;
};
