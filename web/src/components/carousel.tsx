import { ReactNode, useState } from "react";
import Image from "next/image";

import CarouselCornerSvg from "@/images/carousel_corner.svg";
import ArrowButton from "@/components/arrow-button";
import CarouselDots from "@/components/carousel-dots";

interface IProps {
  items: ReactNode[];
}

export default function Carousel(props: IProps) {
  const [active, setActive] = useState<number>(0);

  const handleLeftClick = () => {
    if (active === 0) {
      setActive(props.items.length - 1);
    } else {
      setActive((active - 1) % props.items.length);
    }
  };

  const handleRightClick = () => {
    setActive((active + 1) % props.items.length);
  };

  return (
    <div className="flex gap-3 w-full h-full">
      <ArrowButton isLeft onClick={handleLeftClick} />
      <div className="flex justify-center relative grow w-full h-full min-h-72 p-12">
        <Image
          className="absolute top-0 left-0"
          src={CarouselCornerSvg}
          width={140}
          alt="Carousel corner"
        />
        <Image
          className="absolute top-0 right-0 rotate-90"
          src={CarouselCornerSvg}
          width={140}
          alt="Carousel corner"
        />
        <Image
          className="absolute bottom-0 left-0 -rotate-90"
          src={CarouselCornerSvg}
          width={140}
          alt="Carousel corner"
        />
        <Image
          className="absolute bottom-0 right-0 rotate-180"
          src={CarouselCornerSvg}
          width={140}
          alt="Carousel corner"
        />
        <CarouselDots count={props.items.length} active={active} />
        <div className="grow">{props.items[active]}</div>
      </div>
      <ArrowButton isLeft={false} onClick={handleRightClick} />
    </div>
  );
}
