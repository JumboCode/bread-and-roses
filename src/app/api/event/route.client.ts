export const addEvent = async (request: {
        body: { event: { EventName: string, Description: string, MaxPeople: number, DateTime: Date} };
      }) => {
        const { body, ...options } = request;
        const response = await fetch("/api/event", {
          method: "POST",
          body: JSON.stringify(body),
          ...options,
        });
      
        const json = await response.json();
      
        return json;
      };
      