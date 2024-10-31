import Button from "./button";
import Popup from "./popup";

export default function NpcNotePopup() {
  return (
    <Popup title="Edit NPC Note">
      <div className="flex flex-col p-8 gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-sm">NPC Name</p>
          <input
            className="flex-grow px-3 py-2 rounded text-grayscale-500 text-base bg-grayscale-900 focus:outline focus:outline-highlight"
            type="text"
            placeholder="Name of NPC"
            readOnly
            value="Alice Bob"
          />
          <p className="text-sm">Note</p>
          <input
            className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
            type="text"
            placeholder="Optional note for NPC"
          />
        </div>
        <div className="flex justify-center gap-4">
          <Button text="Save" />
        </div>
      </div>
    </Popup>
  );
}
