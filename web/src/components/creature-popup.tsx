import Button from "./button";
import Popup from "./popup";

export default function CreaturePopup() {
  return (
    <Popup title="Create New Creature">
      <div className="flex flex-col p-8 gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-sm">Name</p>
          <input
            className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
            type="text"
            placeholder="Name of the new creature"
          />
        </div>
        <div className="flex justify-center gap-4">
          <Button text="Create" />
        </div>
      </div>
    </Popup>
  );
}
