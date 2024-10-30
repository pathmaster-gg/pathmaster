import Image from "next/image";

import CheckboxDefaultSvg from "@/images/icons/checkbox_default.svg";
import CheckboxCheckedSvg from "@/images/icons/checkbox_checked.svg";

interface IProps {
  title: string;
  description: string;
  checked?: boolean;
  onClick?: Function;
}

export default function Objective(props: IProps) {
  return (
    <div className="flex gap-4 items-start py-1.5">
      <Image
        priority
        className="cursor-pointer"
        src={props.checked ? CheckboxCheckedSvg : CheckboxDefaultSvg}
        alt="Checkbox status"
        width={28}
        onClick={() => {
          if (props.onClick) {
            props.onClick();
          }
        }}
      />
      <div
        className={`flex flex-col gap-2 ${props.checked ? "line-through text-grayscale-600" : ""}`}
      >
        <h4 className="text-xl">{props.title}</h4>
        <p className="text-base pl-4 pr-2">{props.description}</p>
      </div>
    </div>
  );
}
