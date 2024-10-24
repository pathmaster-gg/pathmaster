export default function ImageUploader() {
  return (
    <div className="flex justify-center items-center w-52 h-64 border-2 border-dashed border-highlight cursor-pointer hover:bg-grayscale-900">
      <div className="relative flex justify-center items-center w-10 h-10">
        <div className="absolute w-full h-px bg-highlight"></div>
        <div className="absolute w-px h-full bg-highlight"></div>
      </div>
    </div>
  );
}
