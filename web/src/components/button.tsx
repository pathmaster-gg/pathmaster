import Link from "next/link";

interface IProps {
  disabled?: boolean;
  text: string;
  onClick?: Function;
  link?: string;
}

export default function Button(props: IProps) {
  const button = (
    <div
      className={`flex min-w-44 h-12 px-5 bg-button items-center justify-center border select-none ${
        props.disabled
          ? "border-grayscale-500 cursor-not-allowed text-disabled"
          : "hover:bg-grayscale-900 border-highlight cursor-pointer"
      }`}
      onClick={() => {
        if (!props.disabled && props.onClick) {
          props.onClick();
        }
      }}
    >
      <span className="text-lg">{props.text}</span>
    </div>
  );

  if (props.link) {
    return <Link href={props.link}>{button}</Link>;
  } else {
    return button;
  }
}
