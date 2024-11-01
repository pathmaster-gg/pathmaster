import { ReactNode } from "react";

interface IProps {
  children?: ReactNode[];
}

export default function List(props: IProps) {
  return props.children === undefined || props.children.length === 0 ? (
    <div className="h-full flex flex-col items-center justify-center">
      <p className="text-2xl text-grayscale-500 select-none">Empty</p>
    </div>
  ) : (
    <div className="h-full flex flex-col items-stretch overflow-scroll">
      {props.children}
    </div>
  );
}
