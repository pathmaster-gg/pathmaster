import Button from "./button";
import Popup from "./popup";

export default function NpcPopup() {
  return (
    <Popup title="Create New NPC">
      <div className="flex flex-col p-8 gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-sm">Name</p>
          <input
            className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
            type="text"
            placeholder="Name of the new NPC"
          />
        </div>
        <div className="flex justify-center gap-4">
          <Button text="Create" />
        </div>
      </div>
    </Popup>
  );
}
