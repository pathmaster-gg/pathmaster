import Image from "next/image";

import AvatarFrameSvg from "@/images/avatar_frame.svg";
import BgLevelSvg from "@/images/icons/bg_level.svg";
import ExamplePlayer1 from "@/images/example_player_1.jpg";
import ExamplePlayer2 from "@/images/example_player_2.jpg";
import ExamplePlayer3 from "@/images/example_player_3.jpg";
import ExamplePlayer4 from "@/images/example_player_4.jpg";

interface IProps {
  ind: number;
  level: number;
}

export default function PlayerAvatar(props: IProps) {
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
        src={
          props.ind % 4 === 0
            ? ExamplePlayer1
            : props.ind % 4 === 1
              ? ExamplePlayer2
              : props.ind % 4 === 2
                ? ExamplePlayer3
                : ExamplePlayer4
        }
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
      <p className="absolute text-white right-1.5 bottom-px">{props.level}</p>
    </div>
  );
}
