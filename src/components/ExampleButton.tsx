import { addUser } from "@api/user/route.client";
import { Icon } from "@iconify/react/dist/iconify.js";
import {addEvent} from "@api/event/route.client";

interface ExampleButtonProps {
  buttonText: string;
}

const ExampleButton = ({ buttonText }: ExampleButtonProps) => {
  return (
    <button
      className="bg-slate-700 text-white p-4 rounded-full flex flex-row items-center gap-3"
      onClick={async () => {
        const response = await addUser({
          body: {
            user: {
              firstName: "Johnny",
              email: "johnny.tan.best.pm@tufts.edu",
            },
          },
        });

        const response2 = await addEvent({
          body: {
            event: {
              EventName: "bread & roses meeting :)",
              DateTime: new Date("2024-10-18"),
              Description: "friday meeting yippee",
              MaxPeople: 10000,
            },
          },
        });

        console.log(response);
        console.log(response2);
      }}
    >
      {buttonText}
      <Icon icon="tabler:click" width="20" />
    </button>
  );
};

export default ExampleButton;
