import Button from "./button";
import Popup from "./popup";

export default function TextEditPopup() {
  return (
    <Popup>
      <div className="flex flex-col p-8 gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-md">Set a new description for your adventure:</p>
          <textarea
            className="min-h-64 px-3 py-2 rounded-lg text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
            placeholder="Adventure description"
          />
        </div>
        <div className="flex justify-center">
          <Button text="Save" />
        </div>
      </div>
    </Popup>
  );
}
