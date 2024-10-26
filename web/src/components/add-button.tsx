import Link from "next/link";

interface IProps {
  link?: string;
  onClick?: Function;
}

export default function AddButton(props: IProps) {
  const button = (
    <div
      className="relative flex items-center justify-center w-8 h-8 p-2 cursor-pointer hover:bg-grayscale-900"
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }
      }}
    >
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="absolute w-full h-px bg-white"></div>
        <div className="absolute w-px h-full bg-white"></div>
      </div>
    </div>
  );

  return props.link ? <Link href={props.link}>{button}</Link> : button;
}
