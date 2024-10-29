import Image from "next/image";

import AvatarFrameSvg from "@/images/avatar_frame.svg";
import BgLevelSvg from "@/images/icons/bg_level.svg";
import ExamplePlayer from "@/images/example_player.jpg";

export default function PlayerAvatar() {
  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      <Image
        className="absolute rounded-full"
        src={AvatarFrameSvg}
        alt="Player avatar frame"
        width={80}
        height={80}
      />
      <Image
        className="absolute rounded-full"
        src={ExamplePlayer}
        alt="Player avatar"
        width={51}
        height={51}
      />
      <Image
        className="absolute right-0 bottom-0"
        src={BgLevelSvg}
        alt="Player level frame"
        width={20}
        height={20}
      />
      <p className="absolute text-white right-1.5 bottom-px">1</p>
    </div>
  );
}
