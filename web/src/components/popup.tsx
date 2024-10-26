import { ReactNode } from "react";

import CloseButton from "./close-button";

interface IProps {
  title: string;
  children: ReactNode;
  onClose?: Function;
}

export default function Popup(props: IProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-8 bg-black/80">
      <div className="flex flex-col w-full max-w-200 rounded-3xl bg-background">
        <div className="relative flex justify-center p-5">
          <h2 className="text-2xl">{props.title}</h2>
          <div className="absolute right-6">
            <CloseButton onClick={props.onClose} />
          </div>
        </div>
        <div className="w-full h-px bg-grayscale-700"></div>
        {props.children}
      </div>
    </div>
  );
}
