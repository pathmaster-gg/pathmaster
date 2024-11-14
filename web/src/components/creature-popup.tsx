import { useEffect, useState } from "react";

import { AdventureCreature } from "@/lib/models";
import Button from "./button";
import Popup from "./popup";
import AiButton from "./ai-button";
import ImageUploader from "./image-uploader";

interface IProps {
  mode: "create" | "edit" | "view";
  creature?: AdventureCreature;
  onClose?: Function;
  onSubmit?: Function;
  onDelete?: Function;
}

export default function CreaturePopup(props: IProps) {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (props.creature) {
      setName(props.creature.name);
    } else {
      setName("");
    }
  }, [props.creature]);

  return (
    <Popup
      title={
        props.mode === "create"
          ? "Create New Creature"
          : props.mode === "edit"
            ? "Edit Creature"
            : "View Creature"
      }
      onClose={props.onClose}
    >
      <div className="flex flex-col p-8 gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-sm">Name</p>
          <input
            className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
            type="text"
            placeholder="Name of the new Creature"
            value={name}
            onChange={(e) => setName(e.target.value)}
            readOnly={props.mode === "view"}
          />
          <p className="text-sm">Avatar</p>
          <div className="flex items-center justify-center gap-6">
            <ImageUploader
              width={200}
              height={200}
              onImageIdChange={() => {}}
            />
            <AiButton className="absolute ml-72" onClick={() => {}} />
          </div>
        </div>
        {props.mode !== "view" && (
          <div className="flex justify-center gap-4">
            <Button
              text={props.mode === "create" ? "Create" : "Save"}
              onClick={() => {
                if (props.onSubmit) {
                  props.onSubmit(name);
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
