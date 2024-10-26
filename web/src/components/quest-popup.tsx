import Button from "./button";
import Popup from "./popup";

export default function QuestPopup() {
  return (
    <Popup title="Create New Quest">
      <div className="flex flex-col p-8 gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-sm">Name</p>
          <input
            className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
            type="text"
            placeholder="Name of the new quest"
          />
          <p className="text-sm">Description</p>
          <input
            className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
            type="text"
            placeholder="A brief description of the quest's goals"
          />
        </div>
        <div className="flex justify-center">
          <Button text="Create" />
        </div>
      </div>
    </Popup>
  );
}
