import Image from "next/image";

import LogoHeroSvg from "@/images/logo_hero.svg";

interface IProps {
  width: number;
}

export default function LogoHero(props: IProps) {
  return (
    <Image
      priority
      src={LogoHeroSvg}
      alt="PathMaster logo"
      width={props.width}
    />
  );
}
