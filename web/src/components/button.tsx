interface IProps {
  disabled?: boolean;
  text: string;
  onClick: Function;
}

export default function Button(props: IProps) {
  return (
    <div
      className={`flex w-44 h-12 bg-button items-center justify-center border select-none ${
        props.disabled
          ? "border-grayscale-500 cursor-not-allowed text-disabled"
          : "hover:bg-grayscale-900 border-highlight cursor-pointer"
      }`}
      onClick={() => {
        if (!props.disabled) {
          props.onClick();
        }
      }}
    >
      <span className="text-lg">{props.text}</span>
    </div>
  );
}
