import Image from "next/image";

import CarouselCornerSvg from "@/images/carousel_corner.svg";
import ArrowButton from "@/components/arrow-button";
import CarouselDots from "@/components/carousel-dots";
import CarouselAdventure from "./carousel-adventure";

export default function Carousel() {
  return (
    <div className="flex gap-3 w-full h-full">
      <ArrowButton />
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
        <CarouselDots />
        <div className="grow">
          <CarouselAdventure />
        </div>
      </div>
      <ArrowButton />
    </div>
  );
}
