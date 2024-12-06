export const verifyCode = async (email: string, code: string) => {
  const response = await fetch("/api/verify-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  const json = await response.json();

  return json;
};
