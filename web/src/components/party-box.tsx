import Box from "./box";
import PlayerCard from "./player-card";

export default function PartyBox() {
  return (
    <Box className="min-h-120">
      <div className="flex flex-col h-full gap-6">
        <div className="flex items-center justify-between pt-4 px-6">
          <h3 className="text-2xl">Party</h3>
        </div>
        <div className="h-full flex flex-col items-stretch gap-4 overflow-scroll px-5 pb-4">
          <PlayerCard />
          <PlayerCard />
          <PlayerCard />
          <PlayerCard empty />
        </div>
      </div>
    </Box>
  );
}
