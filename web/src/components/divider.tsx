export default function Divider() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      <div className="absolute w-full h-px bg-highlight"></div>
      <div className="absolute w-2 h-2 bg-highlight rotate-45"></div>
    </div>
  );
}
