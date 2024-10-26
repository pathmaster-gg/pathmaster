"use client";

import AdventureCover from "@/components/adventure-cover";
import Carousel from "@/components/carousel";
import CarouselAdventure from "@/components/carousel-adventure";
import Divider from "@/components/divider";
import Header from "@/components/header";

import ExampleCover from "@/images/cover_kingmaker.jpg";

export default function AdventureHub() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      <Header pageName="Adventure Hub" />
      <div className="flex justify-center">
        <div className=" flex flex-col grow max-w-screen-xl gap-10">
          <div className="flex flex-col gap-3 px-6">
            <h2 className="text-2xl">Discover new Adventures</h2>
            <p>Explore adventures and start new game sessions.</p>
          </div>
          <Divider />
          <div className="flex h-120">
            <Carousel
              items={[
                <CarouselAdventure
                  key="0"
                  name="Kingmaker"
                  cover={ExampleCover}
                  detailsLink="/adventure?id=1"
                />,
                <CarouselAdventure
                  key="1"
                  name="Hellknight Hill"
                  cover={ExampleCover}
                  detailsLink="/adventure?id=2"
                />,
                <CarouselAdventure
                  key="2"
                  name="Prey for Death"
                  cover={ExampleCover}
                  detailsLink="/adventure?id=3"
                />,
              ]}
            />
          </div>
          <div className="flex flex-col gap-16">
            <Divider />
            <div className="flex flex-col gap-12 px-6">
              <h2 className="text-3xl">Most Popular</h2>
              <div className="grid grid-cols-4">
                <AdventureCover name="Kingmaker" image={ExampleCover} />
                <AdventureCover
                  name="The Great Toy Heist"
                  image={ExampleCover}
                />
                <AdventureCover name="Prey for Death" image={ExampleCover} />
                <AdventureCover
                  name="Abomination Vaults"
                  image={ExampleCover}
                />
              </div>
            </div>
            <Divider />
            <div className="flex flex-col gap-12 px-6">
              <h2 className="text-3xl">Recently Added</h2>
              <div className="grid grid-cols-4">
                <AdventureCover name="Kingmaker" image={ExampleCover} />
                <AdventureCover
                  name="The Great Toy Heist"
                  image={ExampleCover}
                />
                <AdventureCover name="Prey for Death" image={ExampleCover} />
                <AdventureCover
                  name="Abomination Vaults"
                  image={ExampleCover}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
