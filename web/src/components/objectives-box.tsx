import { AdventureQuest } from "@/lib/models";
import Box from "./box";
import Objective from "./objective";

interface IProps {
  quests?: AdventureQuest[];
  finished: number[];
  onFinish?: Function;
  onUnfinish?: Function;
}

export default function ObjectivesBox(props: IProps) {
  return (
    <Box className="col-span-3 min-h-120">
      <div className="flex flex-col h-full gap-4">
        <div className="flex items-center justify-between pt-4 px-6">
          <h3 className="text-2xl">Objectives</h3>
        </div>
        <div className="h-full flex flex-col items-stretch gap-2 overflow-scroll px-6 pb-4">
          {props.quests &&
            props.quests.map((quest) => (
              <Objective
                key={quest.id}
                title={quest.title}
                description={quest.description}
                checked={props.finished.indexOf(quest.id) >= 0}
                onClick={() => {
                  if (props.finished.indexOf(quest.id) >= 0) {
                    if (props.onUnfinish) {
                      props.onUnfinish(quest.id);
                    }
                  } else {
                    if (props.onFinish) {
                      props.onFinish(quest.id);
                    }
                  }
                }}
              />
            ))}
        </div>
      </div>
    </Box>
  );
}
