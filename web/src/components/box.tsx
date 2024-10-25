import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  className?: string;
  extraMargin?: boolean;
}

export default function Box(props: IProps) {
  return (
    <div
      className={`${props.extraMargin && "p-4 bg-background"} ${props.className}`}
    >
      <div className="h-full p-1.5 border border-highlight">
        <div className="h-full bg-background border border-highlight">
          {props.children}
        </div>
      </div>
    </div>
  );
}
