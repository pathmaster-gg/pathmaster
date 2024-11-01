"use client";

import { useEffect, useState } from "react";

import AdventureCover from "@/components/adventure-cover";
import Carousel from "@/components/carousel";
import CarouselAdventure from "@/components/carousel-adventure";
import Divider from "@/components/divider";
import Header from "@/components/header";
import { AdventureHub as AdventureHubModel } from "@/lib/models";
import { getServerUrl } from "@/lib/constants/env";

export default function AdventureHub() {
  const [hub, setHub] = useState<AdventureHubModel | undefined>();

  const loadHub = async () => {
    const hubResponse = await fetch(getServerUrl("/api/adventure/hub"));
    const hubBody = (await hubResponse.json()) as AdventureHubModel;

    setHub(hubBody);
  };

  useEffect(() => {
    loadHub();
  }, []);

  return (
    <div className="w-full min-h-full bg-mask-background">
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
                items={
                  hub
                    ? hub.featured.map((item) => (
                        <CarouselAdventure
                          key={item.id}
                          name={item.name}
                          cover={getServerUrl(`/api/image/${item.cover_image}`)}
                          description={item.description}
                          startAdventureLink={`/session/new?adventure=${item.id}`}
                          detailsLink={`/adventure?id=${item.id}`}
                        />
                      ))
                    : []
                }
              />
            </div>
            <div className="flex flex-col gap-16">
              <Divider />
              <div className="flex flex-col gap-12 px-6">
                <h2 className="text-3xl">Most Popular</h2>
                <div className="grid grid-cols-4">
                  {hub?.popular.map((item) => (
                    <AdventureCover
                      key={item.id}
                      name={item.name}
                      image={getServerUrl(`/api/image/${item.cover_image}`)}
                      link={`/adventure?id=${item.id}`}
                    />
                  ))}
                </div>
              </div>
              <Divider />
              <div className="flex flex-col gap-12 px-6">
                <h2 className="text-3xl">Recently Added</h2>
                <div className="grid grid-cols-4">
                  {hub?.latest.map((item) => (
                    <AdventureCover
                      key={item.id}
                      name={item.name}
                      image={getServerUrl(`/api/image/${item.cover_image}`)}
                      link={`/adventure?id=${item.id}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
