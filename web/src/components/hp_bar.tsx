interface IProps {
  ratio: number;
}

export default function HpBar(props: IProps) {
  return (
    <div className="w-full max-w-32 h-2 my-1 border border-grayscale-200 rounded">
      <div
        className="h-full bg-hp rounded"
        style={{
          width: `${props.ratio * 100}%`,
        }}
      ></div>
    </div>
  );
}
