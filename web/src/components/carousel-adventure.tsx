import Image from "next/image";

import ExampleCover from "@/images/cover_kingmaker.jpg";
import Button from "@/components/button";

export default function CarouselAdventure() {
  return (
    <div className="flex items-start gap-7">
      <Image
        className="border-2 border-highlight"
        src={ExampleCover}
        width={275}
        alt="Adventure cover"
      />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h3 className="text-3xl">Abomination Vaults Bundle</h3>
          <div className="flex flex-col gap-3">
            <p className="text-sm">
              A megadungeon full of beasts, traps, and a spiteful villain
              determined to rise again! The complete Adventure Path taking
              characters from levels 1 to 11.
            </p>
            <p className="text-sm">
              Written by James Jacobs, Vanessa Hoskins, and Stephen
              Radney-MacFarland
            </p>
            <p className="text-sm">Release: 25 May 2022</p>
            <p className="text-sm">Level: 1st - 10th</p>
            <p className="text-sm">
              When the mysterious Gauntlight, an eerie landlocked lighthouse,
              glows with baleful light, the people of Otari know something
              terrible is beginning. The town&apos;s newest heroes must venture
              into the ruins around the lighthouse and delve the dungeon levels
              far beneath it to discover the evil the Gauntlight heralds.
              Hideous monsters, deadly traps, and mysterious ghosts all await
              the heroes who dare to enter the sprawling megadungeon called the
              Abomination Vaults!
            </p>
          </div>
        </div>
        <div className="flex gap-6">
          <Button text="Start Adventure" onClick={() => {}} />
          <Button text="View Details" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
}
