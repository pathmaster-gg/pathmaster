import Image from "next/image";

import AsteriskSvg from "@/images/icons/asterisk.svg";

interface IProps {
  content: string;
  asterisk?: boolean;
  onClick?: Function;
}

export default function ListItem(props: IProps) {
  return (
    <div
      className="flex items-center justify-between px-6 py-2 cursor-pointer hover:bg-grayscale-900"
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }
      }}
    >
      <p className="text-lg">{props.content}</p>
      {props.asterisk && <Image width={13} src={AsteriskSvg} alt="Asterisk" />}
    </div>
  );
}
