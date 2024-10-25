import Link from "next/link";

interface IProps {
  link: string;
}

export default function AddButton(props: IProps) {
  return (
    <Link href={props.link}>
      <div className="relative flex items-center justify-center w-10 h-10 p-2 cursor-pointer hover:bg-grayscale-900">
        <div className="relative flex items-center justify-center w-full h-full">
          <div className="absolute w-full h-px bg-white"></div>
          <div className="absolute w-px h-full bg-white"></div>
        </div>
      </div>
    </Link>
  );
}
