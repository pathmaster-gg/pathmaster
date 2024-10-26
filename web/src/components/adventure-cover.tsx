import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

import Box from "./box";
import Link from "next/link";

interface IProps {
  name: string;
  image: string | StaticImport;
  link: string;
}

export default function AdventureCover(props: IProps) {
  return (
    <div className="flex flex-col items-center">
      <Link href={props.link}>
        <Image
          priority
          src={props.image}
          alt="Adventure cover image"
          className="border-t border-l border-r border-highlight"
          width={200}
          height={200}
        />
      </Link>
      <Link href={props.link}>
        <Box className="w-64">
          <div className="flex justify-center p-2">
            <p>{props.name}</p>
          </div>
        </Box>
      </Link>
    </div>
  );
}
