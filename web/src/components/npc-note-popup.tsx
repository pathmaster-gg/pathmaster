import { useEffect, useState } from "react";

import Button from "./button";
import Popup from "./popup";

interface IProps {
  name: string;
  initNote: string;
  onClose?: Function;
  onSubmit?: Function;
}

export default function NpcNotePopup(props: IProps) {
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    if (props.initNote) {
      setNote(props.initNote);
    } else {
      setNote("");
    }
  }, [props.initNote]);

  return (
    <Popup title="Edit NPC Note" onClose={props.onClose}>
      <div className="flex flex-col p-8 gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-sm">NPC Name</p>
          <input
            className="flex-grow px-3 py-2 rounded text-grayscale-500 text-base bg-grayscale-900 focus:outline focus:outline-highlight"
            type="text"
            placeholder="Name of NPC"
            readOnly
            value={props.name}
          />
          <p className="text-sm">Note</p>
          <input
            className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
            type="text"
            placeholder="Optional note for NPC"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="flex justify-center gap-4">
          <Button
            text="Save"
            onClick={() => {
              if (props.onSubmit) {
                props.onSubmit(note);
              }
            }}
          />
        </div>
      </div>
    </Popup>
  );
}
