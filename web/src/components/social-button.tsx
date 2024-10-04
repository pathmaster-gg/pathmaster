import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface IProps {
  href: string;
  icon: string | StaticImport;
}

export default function SocialButton(props: IProps) {
  return (
    <a href={props.href} rel="noopener noreferrer" target="_blank">
      <div className="flex w-14 h-14 items-center justify-center rounded-full bg-background hover:bg-grayscale-900">
        <Image src={props.icon} width={30} alt="Icon" />
      </div>
    </a>
  );
}
