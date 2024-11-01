import Image from "next/image";

import RobotSvg from "@/images/icons/robot.svg";

interface IProps {
  onClick: Function;
}

export default function AiButton(props: IProps) {
  return (
    <div
      className="flex items-center justify-center w-14 h-14 rounded-xl border border-highlight cursor-pointer hover:bg-grayscale-900"
      onClick={() => {
        props.onClick();
      }}
    >
      <Image priority src={RobotSvg} alt="Robot icon" width={30} />
    </div>
  );
}
