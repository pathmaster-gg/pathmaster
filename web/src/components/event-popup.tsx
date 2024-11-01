import { GameSessionEvent } from "@/lib/models";
import Button from "./button";
import Popup from "./popup";
import { useEffect, useState } from "react";

interface IProps {
  event?: GameSessionEvent;
  onClose?: Function;
  onSubmit?: Function;
}

export default function EventPopup(props: IProps) {
  const [name, setName] = useState<string>();

  useEffect(() => {
    if (props.event) {
      setName(props.event.name);
    } else {
      setName("");
    }
  }, [props.event]);

  return (
    <Popup
      title={props.event ? "Edit event" : "Create event"}
      onClose={props.onClose}
    >
      <div className="flex flex-col p-8 gap-6">
        <div className="flex flex-col gap-4">
          {props.event && (
            <>
              <p className="text-sm">Time</p>
              <input
                className="flex-grow px-3 py-2 rounded text-grayscale-500 text-base bg-grayscale-900 focus:outline focus:outline-highlight"
                type="text"
                placeholder="Time of the event"
                readOnly
                value={new Date(props.event.timestamp * 1000).toLocaleString()}
              />
            </>
          )}
          <p className="text-sm">Name</p>
          <input
            className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
            type="text"
            placeholder="Name of the event"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex justify-center gap-4">
          <Button
            text={props.event ? "Save" : "Create"}
            onClick={() => {
              if (props.onSubmit) {
                props.onSubmit(name);
              }
            }}
          />
        </div>
      </div>
    </Popup>
  );
}
