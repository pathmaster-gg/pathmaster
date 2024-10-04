interface IProps {
  enabled: boolean;
  text: string;
  onClick: Function;
}

export default function Button(props: IProps) {
  return (
    <div
      className={`flex w-44 h-12 bg-background items-center justify-center border select-none ${
        props.enabled
          ? "hover:bg-grayscale-900 border-highlight cursor-pointer"
          : "border-grayscale-500 cursor-not-allowed text-disabled"
      }`}
      onClick={() => {
        if (props.enabled) {
          props.onClick();
        }
      }}
    >
      <span className="text-lg">{props.text}</span>
    </div>
  );
}
