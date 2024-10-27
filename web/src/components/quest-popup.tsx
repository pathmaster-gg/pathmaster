import { useState } from "react";

import Button from "./button";
import Popup from "./popup";

interface IProps {
  onClose?: Function;
  onCreate?: Function;
}

export default function QuestPopup(props: IProps) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  return (
    <Popup title="Create New Quest" onClose={props.onClose}>
      <div className="flex flex-col p-8 gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-sm">Name</p>
          <input
            className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
            type="text"
            placeholder="Name of the new quest"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="text-sm">Description</p>
          <input
            className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
            type="text"
            placeholder="A brief description of the quest's goals"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-center">
          <Button
            text="Create"
            onClick={() => {
              if (props.onCreate) {
                props.onCreate(name, description);
              }
            }}
          />
        </div>
      </div>
    </Popup>
  );
}
