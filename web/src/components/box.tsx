import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

export default function Box(props: IProps) {
  return (
    <div className="bg-background p-4">
      <div className="p-1.5 border border-highlight">
        <div className="border border-highlight">{props.children}</div>
      </div>
    </div>
  );
}
