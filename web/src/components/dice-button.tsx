import Image from "next/image";

import DiceSvg from "@/images/icons/dice.svg";

interface IProps {
  onClick: Function;
}

export default function DiceButton(props: IProps) {
  return (
    <div
      className="flex items-center justify-center w-14 h-14 rounded-xl border border-highlight cursor-pointer hover:bg-grayscale-900"
      onClick={() => {
        props.onClick();
      }}
    >
      <Image priority src={DiceSvg} alt="Dice icon" width={30} />
    </div>
  );
}
