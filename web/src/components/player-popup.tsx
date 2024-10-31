import Button from "./button";
import Popup from "./popup";

export default function PlayerPopup() {
  return (
    <Popup title="Add New Player">
      <div className="flex flex-col p-8 gap-6">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex flex-col gap-4">
              <p className="text-sm">Name</p>
              <input
                className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
                type="text"
                placeholder="Name of the player"
              />
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sm">Ancestry</p>
              <input
                className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
                type="text"
                placeholder="Ancestry of the player"
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
              />
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sm">HP</p>
              <input
                className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
                type="text"
                placeholder="Current HP of the player"
              />
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sm">Max HP</p>
              <input
                className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
                type="text"
                placeholder="Max HP of the player"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Button text="Create" />
        </div>
      </div>
    </Popup>
  );
}
