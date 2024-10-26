import { ReactNode } from "react";

import Box from "@/components/box";
import Divider from "@/components/divider";
import EditButton from "@/components/edit-button";
import AddButton from "./add-button";

interface IProps {
  title: string;
  large?: boolean;
  button?: "edit" | "add";
  children: ReactNode | ReactNode[];
  onEdit?: Function;
}

export default function AdventurePartCard(props: IProps) {
  return (
    <Box className={`min-h-96 ${props.large ? "max-h-156" : "max-h-120"}`}>
      <div className="flex flex-col h-full gap-4">
        <div className="flex items-center justify-between pt-4 px-6">
          <h3 className="text-2xl">{props.title}</h3>
          {props.button === "edit" && <EditButton onClick={props.onEdit} />}
          {props.button === "add" && <AddButton />}
        </div>
        <Divider />
        <div className="h-full flex flex-col items-stretch gap-4 overflow-scroll">
          {props.children}
        </div>
      </div>
    </Box>
  );
}
