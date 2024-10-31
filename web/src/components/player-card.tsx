import { GameSessionPlayer } from "@/lib/models";
import HpBar from "./hp_bar";
import PlayerAvatar from "./player-avatar";

interface IProps {
  player?: GameSessionPlayer;
  onClick?: Function;
}

export default function PlayerCard(props: IProps) {
  return (
    <div
      className="h-26 flex border-2 border-grayscale-900 rounded-lg px-2 cursor-pointer hover:bg-grayscale-900 active:bg-grayscale-700"
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }
      }}
    >
      {props.player ? (
        <div className="flex grow items-center gap-3 pl-1">
          <PlayerAvatar level={props.player.level} />
          <div className="grow flex flex-col">
            <p className="text-lg">{props.player.name}</p>
            <p className="text-sm">{props.player.ancestry}</p>
            <HpBar
              ratio={
                props.player.hp_max === 0
                  ? 0
                  : props.player.hp / props.player.hp_max
              }
            />
            <p className="text-sm">
              {props.player.hp} / {props.player.hp_max}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex grow items-center justify-center">
          <p className="text-lg text-grayscale-500 select-none">Add Player</p>
        </div>
      )}
    </div>
  );
}
