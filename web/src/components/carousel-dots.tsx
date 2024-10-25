export default function CarouselDots() {
  return (
    <div className="absolute bottom-0 w-full flex justify-center">
      <div className="flex gap-1.5">
        <div className="w-1.5 h-1.5 rounded bg-highlight"></div>
        <div className="w-1.5 h-1.5 rounded bg-grayscale-500"></div>
        <div className="w-1.5 h-1.5 rounded bg-grayscale-500"></div>
      </div>
    </div>
  );
}
