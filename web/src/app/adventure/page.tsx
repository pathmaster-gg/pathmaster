"use client";

import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import AdventurePartCard from "@/components/adventure-part-card";
import Box from "@/components/box";
import CarouselAdventure from "@/components/carousel-adventure";
import Header from "@/components/header";
import List from "@/components/list";
import ListItem from "@/components/list-item";
import { Adventure } from "@/lib/models";
import { IdentityContext } from "../lib/context/identity";
import { getServerUrl } from "@/lib/constants/env";
import TextEditPopup from "@/components/text-edit-popup";

export default function AdventureDetails() {
  const identity = useContext(IdentityContext);

  const searchParams = useSearchParams();

  const id = parseInt(searchParams.get("id") as string);

  const [adventure, setAdventure] = useState<Adventure | undefined>(undefined);
  const [editingDescription, setEditingDescription] = useState<boolean>(false);
  const [editingBackground, setEditingBackground] = useState<boolean>(false);

  const isOwner = adventure ? adventure.is_owner : false;

  const handleDescriptionEdit = async (value: string) => {
    await fetch(getServerUrl(`/api/adventure/${id}`), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${identity.session!.token}`,
      },
      body: JSON.stringify({
        description: value,
      }),
    });

    setEditingDescription(false);

    await loadAdventure();
  };

  const handleBackgroundEdit = async (value: string) => {
    await fetch(getServerUrl(`/api/adventure/${id}`), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${identity.session!.token}`,
      },
      body: JSON.stringify({
        background: value,
      }),
    });

    setEditingBackground(false);

    await loadAdventure();
  };

  const backgroundPars: string[] | undefined = adventure
    ? adventure.background
      ? adventure.background.split("\n")
      : []
    : undefined;

  const loadAdventure = async () => {
    const adventureResponse = await fetch(
      getServerUrl(`/api/adventure/${id}`),
      {
        headers: identity.session
          ? {
              Authorization: `Bearer ${identity.session.token}`,
            }
          : {},
      },
    );
    const adventureBody = await adventureResponse.json();
    setAdventure(adventureBody);
  };

  useEffect(() => {
    loadAdventure();
  }, [identity.session]);

  return (
    <div className="flex flex-col gap-8 pb-16">
      <Header pageName="Adventure" />
      <div className="flex justify-center">
        <div className="flex flex-col grow max-w-screen-xl gap-6">
          <Box>
            <div className="p-8">
              <CarouselAdventure
                name={adventure?.name ?? ""}
                cover={
                  adventure
                    ? getServerUrl(`/api/image/${adventure.cover_image}`)
                    : ""
                }
                description={adventure?.description}
                onEdit={isOwner ? () => setEditingDescription(true) : undefined}
              />
            </div>
          </Box>
          <div className="grid grid-cols-2 gap-x-6">
            <AdventurePartCard
              title="Background"
              large
              button={isOwner ? "edit" : undefined}
              onEdit={() => setEditingBackground(true)}
            >
              {backgroundPars &&
                backgroundPars.map((p) => (
                  <p key={p} className="px-6">
                    {p}
                  </p>
                ))}
            </AdventurePartCard>
            <AdventurePartCard
              title="Quests"
              large
              button={isOwner ? "add" : undefined}
            >
              <List>
                {adventure &&
                  adventure.quests.map((quest) => (
                    <ListItem key={quest.id} content={quest.title} />
                  ))}
              </List>
            </AdventurePartCard>
          </div>
          <div className="grid grid-cols-3 gap-x-6">
            <AdventurePartCard
              title="NPCs"
              button={isOwner ? "add" : undefined}
            >
              <List>
                {adventure &&
                  adventure.npcs.map((npc) => (
                    <ListItem key={npc.id} content={npc.name} />
                  ))}
              </List>
            </AdventurePartCard>
            <AdventurePartCard
              title="Creatures"
              button={isOwner ? "add" : undefined}
            >
              <List>
                {adventure &&
                  adventure.creatures.map((creature) => (
                    <ListItem key={creature.id} content={creature.name} />
                  ))}
              </List>
            </AdventurePartCard>
            <AdventurePartCard
              title="Items"
              button={isOwner ? "add" : undefined}
            >
              <List>
                {adventure &&
                  adventure.items.map((item) => (
                    <ListItem key={item.id} content={item.name} />
                  ))}
              </List>
            </AdventurePartCard>
          </div>
        </div>
      </div>
      {adventure && editingDescription && (
        <TextEditPopup
          title="Edit Description"
          prompt="Set a new description for your adventure:"
          onClose={() => setEditingDescription(false)}
          initValue={adventure.description ?? ""}
          onSubmit={handleDescriptionEdit}
        />
      )}
      {adventure && editingBackground && (
        <TextEditPopup
          title="Edit Background"
          prompt="Set a new background story for your adventure:"
          onClose={() => setEditingBackground(false)}
          initValue={adventure.background ?? ""}
          onSubmit={handleBackgroundEdit}
        />
      )}
    </div>
  );
}
