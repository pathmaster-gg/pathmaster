interface IProps {
  content: string;
  onClick?: Function;
}

export default function ListItem(props: IProps) {
  return (
    <div
      className="px-6 py-2 cursor-pointer hover:bg-grayscale-900"
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }
      }}
    >
      <p className="text-lg">{props.content}</p>
    </div>
  );
}
