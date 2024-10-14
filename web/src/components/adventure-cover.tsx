import Image, { StaticImageData } from "next/image";

import Box from "./box";

interface IProps {
  name: string;
  image: StaticImageData;
}

export default function AdventureCover(props: IProps) {
  return (
    <div className="flex flex-col items-center">
      <Image
        priority
        src={props.image}
        alt="Adventure cover image"
        className="border-t border-l border-r border-highlight"
        width={200}
      />
      <Box className="w-64">
        <div className="flex justify-center p-2">
          <p>{props.name}</p>
        </div>
      </Box>
    </div>
  );
}
