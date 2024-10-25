import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Link from "next/link";

interface IProps {
  href: string;
  icon: string | StaticImport;
  text: string;
}

export default function LinkButton(props: IProps) {
  return (
    <Link href={props.href} rel="noopener noreferrer">
      <div className="p-2 bg-background hover:bg-grayscale-900">
        <div className="p-1 border border-highlight">
          <div className="flex w-68 h-16 gap-x-4 items-center justify-center border border-highlight">
            <Image src={props.icon} alt="Icon" />
            <span className="text-xl">{props.text}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
