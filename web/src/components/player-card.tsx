import HpBar from "./hp_bar";
import PlayerAvatar from "./player-avatar";

interface IProps {
  empty?: boolean;
}

export default function PlayerCard(props: IProps) {
  return (
    <div className="h-26 flex border-2 border-grayscale-900 rounded-lg px-2 cursor-pointer hover:bg-grayscale-900 active:bg-grayscale-700">
      {props.empty ? (
        <div className="flex grow items-center justify-center">
          <p className="text-lg text-grayscale-500 select-none">Add Player</p>
        </div>
      ) : (
        <div className="flex grow items-center gap-3 pl-1">
          <PlayerAvatar />
          <div className="grow flex flex-col">
            <p className="text-lg">jones</p>
            <p className="text-sm">Human</p>
            <HpBar />
            <p className="text-sm">128 / 160</p>
          </div>
        </div>
      )}
    </div>
  );
}
