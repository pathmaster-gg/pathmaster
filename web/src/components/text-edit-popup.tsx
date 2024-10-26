import { useEffect, useState } from "react";

import Button from "./button";
import Popup from "./popup";

interface IProps {
  title: string;
  prompt: string;
  onClose?: Function;
  initValue: string;
  onSubmit?: Function;
}

export default function TextEditPopup(props: IProps) {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue(props.initValue);
  }, [props.initValue]);

  return (
    <Popup title={props.title} onClose={props.onClose}>
      <div className="flex flex-col p-8 gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-md">{props.prompt}</p>
          <textarea
            className="min-h-64 px-3 py-2 rounded-lg text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
            placeholder="Adventure description"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="flex justify-center">
          <Button
            text="Save"
            onClick={() => {
              if (props.onSubmit) {
                props.onSubmit(value);
              }
            }}
          />
        </div>
      </div>
    </Popup>
  );
}
