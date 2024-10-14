interface IProps {
  label: string;
  value: string;
}

export default function ProfileRow(props: IProps) {
  return (
    <div className="flex justify-between">
      <p className="text-md">{props.label}</p>
      <p className="text-md">{props.value}</p>
    </div>
  );
}
