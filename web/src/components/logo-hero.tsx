import Image from "next/image";

import LogoHeroSvg from "@/images/logo_hero.svg";

export default function LogoHero() {
  return <Image priority src={LogoHeroSvg} alt="PathMaster logo" width={600} />;
}
