import Box from "./box";
import Objective from "./objective";

export default function ObjectivesBox() {
  return (
    <Box className="col-span-3 min-h-120">
      <div className="flex flex-col h-full gap-4">
        <div className="flex items-center justify-between pt-4 px-6">
          <h3 className="text-2xl">Objectives</h3>
        </div>
        <div className="h-full flex flex-col items-stretch gap-2 overflow-scroll px-6 pb-4">
          <Objective checked />
          <Objective />
          <Objective checked />
          <Objective />
        </div>
      </div>
    </Box>
  );
}
