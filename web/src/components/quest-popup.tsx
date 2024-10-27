import { useEffect, useState } from "react";

import Button from "./button";
import Popup from "./popup";
import { AdventureQuest } from "@/lib/models";

interface IProps {
  mode: "create" | "edit" | "view";
  quest?: AdventureQuest;
  onClose?: Function;
  onSubmit?: Function;
  onDelete?: Function;
}

export default function QuestPopup(props: IProps) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (props.quest) {
      setName(props.quest.title);
      setDescription(props.quest.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [props.quest]);

  return (
    <Popup
      title={
        props.mode === "create"
          ? "Create New Quest"
          : props.mode === "edit"
            ? "Edit Quest"
            : "View Quest"
      }
      onClose={props.onClose}
    >
      <div className="flex flex-col p-8 gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-sm">Name</p>
          <input
            className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
            type="text"
            placeholder="Name of the new quest"
            value={name}
            onChange={(e) => setName(e.target.value)}
            readOnly={props.mode === "view"}
          />
          <p className="text-sm">Description</p>
          <input
            className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
            type="text"
            placeholder="A brief description of the quest's goals"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            readOnly={props.mode === "view"}
          />
        </div>
        {props.mode !== "view" && (
          <div className="flex justify-center gap-4">
            <Button
              text={props.mode === "create" ? "Create" : "Save"}
              onClick={() => {
                if (props.onSubmit) {
                  props.onSubmit(name, description);
                }
              }}
            />
            {props.mode === "edit" && (
              <Button
                text="Delete"
                onClick={() => {
                  if (props.onDelete) {
                    props.onDelete();
                  }
                }}
              />
            )}
          </div>
        )}
      </div>
    </Popup>
  );
}
