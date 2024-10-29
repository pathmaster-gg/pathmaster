import { useEffect, useState } from "react";

import { AdventureItem } from "@/lib/models";
import Button from "./button";
import Popup from "./popup";

interface IProps {
  mode: "create" | "edit" | "view";
  item?: AdventureItem;
  onClose?: Function;
  onSubmit?: Function;
  onDelete?: Function;
}

export default function ItemPopup(props: IProps) {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (props.item) {
      setName(props.item.name);
    } else {
      setName("");
    }
  }, [props.item]);

  return (
    <Popup
      title={
        props.mode === "create"
          ? "Create New Item"
          : props.mode === "edit"
            ? "Edit Item"
            : "View Item"
      }
      onClose={props.onClose}
    >
      <div className="flex flex-col p-8 gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-sm">Name</p>
          <input
            className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
            type="text"
            placeholder="Name of the new Item"
            value={name}
            onChange={(e) => setName(e.target.value)}
            readOnly={props.mode === "view"}
          />
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
