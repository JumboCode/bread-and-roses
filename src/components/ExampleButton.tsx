import { Icon } from "@iconify/react/dist/iconify.js";
import { addEvent } from "@api/event/route.client";

interface ExampleButtonProps {
  buttonText: string;
  callBack: () => void;
}

const ExampleButton = ({ buttonText, callBack }: ExampleButtonProps) => {
  return (
    <view>
      <button
        className="bg-slate-700 text-white p-4 rounded-full flex flex-row items-center gap-3"
        onClick={callBack}
      >
        {buttonText}
        <Icon icon="tabler:click" width="20" />
      </button>
    </view>
  );
};

export default ExampleButton;
