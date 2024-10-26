import Image from "next/image";

import EditSvg from "@/images/icons/edit.svg";

interface IProps {
  onClick?: Function;
}

export default function EditButton(props: IProps) {
  return (
    <div
      className="relative flex items-center justify-center w-8 h-8 p-1 cursor-pointer hover:bg-grayscale-900"
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }
      }}
    >
      <div className="relative flex items-center justify-center w-full h-full">
        <Image src={EditSvg} className="w-full h-full" alt="Edit icon" />
      </div>
    </div>
  );
}
