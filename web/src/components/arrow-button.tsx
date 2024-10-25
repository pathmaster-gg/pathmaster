export default function ArrowButton() {
  return (
    <div className="relative flex items-center justify-center w-10 h-full cursor-pointer hover:bg-white/10 active:bg-white/15">
      <div className="relative flex items-center justify-center w-10 h-10 p-2">
        <div className="relative flex items-center justify-center w-full h-full">
          <div className="absolute w-5.4 h-px bg-highlight"></div>
          <div className="absolute top-3.5 left-0 w-2 h-px bg-highlight rotate-45"></div>
          <div className="absolute bottom-3.5 left-0 w-2 h-px bg-highlight -rotate-45"></div>
          <div className="absolute top-3.5 right-0 w-2 h-px bg-highlight -rotate-45"></div>
          <div className="absolute bottom-3.5 right-0 w-2 h-px bg-highlight rotate-45"></div>
        </div>
      </div>
    </div>
  );
}
