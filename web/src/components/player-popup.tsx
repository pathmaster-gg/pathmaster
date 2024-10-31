import { useState } from "react";

import Button from "./button";
import Popup from "./popup";

interface IProps {
  onClose?: Function;
  onSubmit?: Function;
}

export default function PlayerPopup(props: IProps) {
  const [name, setName] = useState<string>("");
  const [ancestry, setAncestry] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [hp, setHp] = useState<string>("");
  const [maxHp, setMaxHp] = useState<string>("");

  return (
    <Popup title="Add New Player" onClose={props.onClose}>
      <div className="flex flex-col p-8 gap-6">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex flex-col gap-4">
              <p className="text-sm">Name</p>
              <input
                className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
                type="text"
                placeholder="Name of the player"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sm">Ancestry</p>
              <input
                className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
                type="text"
                placeholder="Ancestry of the player"
                value={ancestry}
                onChange={(e) => setAncestry(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-x-4">
            <div className="flex flex-col gap-4">
              <p className="text-sm">Level</p>
              <input
                className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
                type="text"
                placeholder="Level of the player"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sm">HP</p>
              <input
                className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
                type="text"
                placeholder="Current HP of the player"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sm">Max HP</p>
              <input
                className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
                type="text"
                placeholder="Max HP of the player"
                value={maxHp}
                onChange={(e) => setMaxHp(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Button
            text="Create"
            onClick={() => {
              if (props.onSubmit) {
                props.onSubmit(name, ancestry, level, hp, maxHp);
              }
            }}
          />
        </div>
      </div>
    </Popup>
  );
}
