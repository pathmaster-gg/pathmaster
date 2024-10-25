interface IProps {
  count: number;
  active: number;
}

export default function CarouselDots(props: IProps) {
  const indices = [];
  for (let i = 0; i < props.count; i++) {
    indices.push(i);
  }

  return (
    <div className="absolute bottom-0 w-full flex justify-center">
      <div className="flex gap-1.5">
        {indices.map((i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded ${i === props.active ? "bg-highlight" : "bg-grayscale-500"}`}
          ></div>
        ))}
      </div>
    </div>
  );
}
