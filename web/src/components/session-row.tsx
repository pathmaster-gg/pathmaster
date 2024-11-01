import Button from "./button";

interface IProps {
  sessionId: number;
  sessionName: string;
  adventureName: string;
}

export default function SessionRow(props: IProps) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-sm">
        {props.sessionName} [{props.adventureName}]
      </p>
      <Button text="Continue" link={`/session?id=${props.sessionId}`} />
    </div>
  );
}
