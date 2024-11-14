import RobotSvg from "@/components/robot-svg";

interface IProps {
  disabled?: boolean;
  onClick: Function;
}

export default function AiButton(props: IProps) {
  return (
    <div
      className={`flex items-center justify-center w-14 h-14 rounded-xl border ${
        props.disabled
          ? "border-grayscale-500 cursor-not-allowed bg-grayscale-999"
          : "border-highlight cursor-pointer hover:bg-grayscale-900"
      }`}
      onClick={() => {
        props.onClick();
      }}
    >
      <RobotSvg gray={props.disabled} />
    </div>
  );
}
