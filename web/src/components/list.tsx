import { ReactNode } from "react";

interface IProps {
  children: ReactNode[];
}

export default function List(props: IProps) {
  return (
    <div className="h-full flex flex-col items-stretch overflow-scroll">
      {props.children}
    </div>
  );
}
