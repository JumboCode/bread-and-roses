export const sendMassEmail = async (text: string) => {
  const response = await fetch("/api/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const json = await response.json();

  return json;
};
