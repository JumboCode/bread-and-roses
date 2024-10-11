import { addUser } from "@api/user/route.client";
import { Icon } from "@iconify/react/dist/iconify.js";

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
        console.log(response);
      }}
    >
      {buttonText}
      <Icon icon="tabler:click" width="20" />
    </button>
  );
};

export default ExampleButton;
