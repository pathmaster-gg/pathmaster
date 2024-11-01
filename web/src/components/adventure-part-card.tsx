import { ReactNode } from "react";

import Box from "@/components/box";
import Divider from "@/components/divider";
import EditButton from "@/components/edit-button";
import AddButton from "./add-button";

interface IProps {
  className?: string;
  title: string;
  large?: boolean;
  button?: "edit" | "add";
  children: ReactNode | ReactNode[];
  onEdit?: Function;
  onAdd?: Function;
}

export default function AdventurePartCard(props: IProps) {
  return (
    <Box
      className={`${props.className} ${props.large ? "min-h-120 max-h-156" : "min-h-96 max-h-120"}`}
    >
      <div className="flex flex-col h-full gap-4">
        <div className="flex items-center justify-between pt-4 px-6">
          <h3 className="text-2xl">{props.title}</h3>
          {props.button === "edit" && <EditButton onClick={props.onEdit} />}
          {props.button === "add" && <AddButton onClick={props.onAdd} />}
        </div>
        <Divider />
        {props.children === undefined ||
        (props.children as ReactNode[]).length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <p className="text-2xl text-grayscale-500 select-none">Empty</p>
          </div>
        ) : (
          <div className="h-full flex flex-col items-stretch gap-4 overflow-scroll">
            {props.children}
          </div>
        )}
      </div>
    </Box>
  );
}
