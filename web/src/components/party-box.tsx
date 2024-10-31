import { GameSessionPlayer } from "@/lib/models";
import Box from "./box";
import PlayerCard from "./player-card";

interface IProps {
  players?: GameSessionPlayer[];
  onAdd?: Function;
  onEdit?: Function;
}

export default function PartyBox(props: IProps) {
  return (
    <Box className="min-h-120">
      <div className="flex flex-col h-full gap-6">
        <div className="flex items-center justify-between pt-4 px-6">
          <h3 className="text-2xl">Party</h3>
        </div>
        <div className="h-full flex flex-col items-stretch gap-4 overflow-scroll px-5 pb-4">
          {props.players && (
            <>
              {props.players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onClick={() => {
                    if (props.onEdit) {
                      props.onEdit(player);
                    }
                  }}
                />
              ))}
              <PlayerCard onClick={props.onAdd} />
            </>
          )}
        </div>
      </div>
    </Box>
  );
}
