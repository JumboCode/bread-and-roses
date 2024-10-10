import { addUser } from "@/app/api/user/route.client";

interface ExampleButtonProps {
  buttonText: string;
}

const ExampleButton = ({ buttonText }: ExampleButtonProps) => {
  return (
    <button
      className="bg-slate-700 text-white p-4 rounded-full"
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
    </button>
  );
};

export default ExampleButton;
