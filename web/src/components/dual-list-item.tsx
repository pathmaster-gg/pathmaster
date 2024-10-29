interface IProps {
  left: string;
  right: string;
}

export default function DualListItem(props: IProps) {
  return (
    <div className="grid grid-cols-4 items-center justify-between px-6 py-2 cursor-pointer hover:bg-grayscale-900">
      <p className="text-lg">{props.left}</p>
      <p className="text-lg col-span-3">{props.right}</p>
    </div>
  );
}
