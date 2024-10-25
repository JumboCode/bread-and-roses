import { addUser } from "@api/user/route.client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { addEvent, deleteEvent, updateEvent } from "@api/event/route.client";

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
        await addEvent({
          body: {
            event: {
              EventName: "eventname",
              Description: "desc",
              MaxPeople: 10,
              DateTime: new Date(),
            },
          },
        });
        // const response2 = await deleteEvent({
        //   body: {
        //     id: "6712a960e56a47a7792d837c",
        //   },
        // });
        console.log(response);
        // console.log(response2);
      }}
    >
      {buttonText}
      <Icon icon="tabler:click" width="20" />
    </button>
  );
};

export default ExampleButton;
