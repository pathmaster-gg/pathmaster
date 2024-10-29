"use client";

import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import AdventurePartCard from "@/components/adventure-part-card";
import Box from "@/components/box";
import CarouselAdventure from "@/components/carousel-adventure";
import Header from "@/components/header";
import List from "@/components/list";
import ListItem from "@/components/list-item";
import {
  Adventure,
  AdventureCreature,
  AdventureItem,
  AdventureNpc,
  AdventureQuest,
} from "@/lib/models";
import { IdentityContext } from "../lib/context/identity";
import { getServerUrl } from "@/lib/constants/env";
import TextEditPopup from "@/components/text-edit-popup";
import QuestPopup from "@/components/quest-popup";
import NpcPopup from "@/components/npc-popup";
import CreaturePopup from "@/components/creature-popup";
import ItemPopup from "@/components/item-popup";

export default function AdventureDetails() {
  const identity = useContext(IdentityContext);

  const searchParams = useSearchParams();

  const id = parseInt(searchParams.get("id") as string);

  const [adventure, setAdventure] = useState<Adventure | undefined>(undefined);
  const [editingDescription, setEditingDescription] = useState<boolean>(false);
  const [editingBackground, setEditingBackground] = useState<boolean>(false);
  const [creatingQuest, setCreatingQuest] = useState<boolean>(false);
  const [activeQuest, setActiveQuest] = useState<AdventureQuest | undefined>();
  const [creatingNpc, setCreatingNpc] = useState<boolean>(false);
  const [activeNpc, setActiveNpc] = useState<AdventureNpc | undefined>();
  const [creatingCreature, setCreatingCreature] = useState<boolean>(false);
  const [activeCreature, setActiveCreature] = useState<
    AdventureCreature | undefined
  >();
  const [creatingItem, setCreatingItem] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<AdventureItem | undefined>();

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

  const handleCreateQuest = async (title: string, description: string) => {
    await fetch(getServerUrl(`/api/quest`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${identity.session!.token}`,
      },
      body: JSON.stringify({
        adventure_id: id,
        title,
        description,
      }),
    });

    setCreatingQuest(false);

    await loadAdventure();
  };

  const handleUpdateQuest = async (
    id: number,
    title: string,
    description: string,
  ) => {
    await fetch(getServerUrl(`/api/quest/${id}`), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${identity.session!.token}`,
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    setActiveQuest(undefined);

    await loadAdventure();
  };

  const handleDeleteQuest = async (id: number) => {
    await fetch(getServerUrl(`/api/quest/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${identity.session!.token}`,
      },
    });

    setActiveQuest(undefined);

    await loadAdventure();
  };

  const handleCreateNpc = async (name: string) => {
    await fetch(getServerUrl(`/api/npc`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${identity.session!.token}`,
      },
      body: JSON.stringify({
        adventure_id: id,
        name,
      }),
    });

    setCreatingNpc(false);

    await loadAdventure();
  };

  const handleUpdateNpc = async (id: number, name: string) => {
    await fetch(getServerUrl(`/api/npc/${id}`), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${identity.session!.token}`,
      },
      body: JSON.stringify({
        name,
      }),
    });

    setActiveNpc(undefined);

    await loadAdventure();
  };

  const handleDeleteNpc = async (id: number) => {
    await fetch(getServerUrl(`/api/npc/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${identity.session!.token}`,
      },
    });

    setActiveNpc(undefined);

    await loadAdventure();
  };

  const handleCreateCreature = async (name: string) => {
    await fetch(getServerUrl(`/api/creature`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${identity.session!.token}`,
      },
      body: JSON.stringify({
        adventure_id: id,
        name,
      }),
    });

    setCreatingCreature(false);

    await loadAdventure();
  };

  const handleUpdateCreature = async (id: number, name: string) => {
    await fetch(getServerUrl(`/api/creature/${id}`), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${identity.session!.token}`,
      },
      body: JSON.stringify({
        name,
      }),
    });

    setActiveCreature(undefined);

    await loadAdventure();
  };

  const handleDeleteCreature = async (id: number) => {
    await fetch(getServerUrl(`/api/creature/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${identity.session!.token}`,
      },
    });

    setActiveCreature(undefined);

    await loadAdventure();
  };

  const handleCreateItem = async (name: string) => {
    await fetch(getServerUrl(`/api/item`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${identity.session!.token}`,
      },
      body: JSON.stringify({
        adventure_id: id,
        name,
      }),
    });

    setCreatingItem(false);

    await loadAdventure();
  };

  const handleUpdateItem = async (id: number, name: string) => {
    await fetch(getServerUrl(`/api/item/${id}`), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${identity.session!.token}`,
      },
      body: JSON.stringify({
        name,
      }),
    });

    setActiveItem(undefined);

    await loadAdventure();
  };

  const handleDeleteItem = async (id: number) => {
    await fetch(getServerUrl(`/api/item/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${identity.session!.token}`,
      },
    });

    setActiveItem(undefined);

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
              onAdd={() => setCreatingQuest(true)}
            >
              <List>
                {adventure &&
                  adventure.quests.map((quest) => (
                    <ListItem
                      key={quest.id}
                      content={quest.title}
                      onClick={() => {
                        setActiveQuest(quest);
                      }}
                    />
                  ))}
              </List>
            </AdventurePartCard>
          </div>
          <div className="grid grid-cols-3 gap-x-6">
            <AdventurePartCard
              title="NPCs"
              button={isOwner ? "add" : undefined}
              onAdd={() => setCreatingNpc(true)}
            >
              <List>
                {adventure &&
                  adventure.npcs.map((npc) => (
                    <ListItem
                      key={npc.id}
                      content={npc.name}
                      onClick={() => {
                        setActiveNpc(npc);
                      }}
                    />
                  ))}
              </List>
            </AdventurePartCard>
            <AdventurePartCard
              title="Creatures"
              button={isOwner ? "add" : undefined}
              onAdd={() => setCreatingCreature(true)}
            >
              <List>
                {adventure &&
                  adventure.creatures.map((creature) => (
                    <ListItem
                      key={creature.id}
                      content={creature.name}
                      onClick={() => {
                        setActiveCreature(creature);
                      }}
                    />
                  ))}
              </List>
            </AdventurePartCard>
            <AdventurePartCard
              title="Items"
              button={isOwner ? "add" : undefined}
              onAdd={() => setCreatingItem(true)}
            >
              <List>
                {adventure &&
                  adventure.items.map((item) => (
                    <ListItem
                      key={item.id}
                      content={item.name}
                      onClick={() => {
                        setActiveItem(item);
                      }}
                    />
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
      {creatingQuest && (
        <QuestPopup
          mode="create"
          onClose={() => setCreatingQuest(false)}
          onSubmit={handleCreateQuest}
        />
      )}
      {activeQuest && (
        <QuestPopup
          mode={isOwner ? "edit" : "view"}
          quest={activeQuest}
          onClose={() => setActiveQuest(undefined)}
          onSubmit={(title: string, description: string) =>
            handleUpdateQuest(activeQuest.id, title, description)
          }
          onDelete={() => handleDeleteQuest(activeQuest.id)}
        />
      )}
      {creatingNpc && (
        <NpcPopup
          mode="create"
          onClose={() => setCreatingNpc(false)}
          onSubmit={handleCreateNpc}
        />
      )}
      {activeNpc && (
        <NpcPopup
          mode={isOwner ? "edit" : "view"}
          npc={activeNpc}
          onClose={() => setActiveNpc(undefined)}
          onSubmit={(name: string) => handleUpdateNpc(activeNpc.id, name)}
          onDelete={() => handleDeleteNpc(activeNpc.id)}
        />
      )}
      {creatingCreature && (
        <CreaturePopup
          mode="create"
          onClose={() => setCreatingCreature(false)}
          onSubmit={handleCreateCreature}
        />
      )}
      {activeCreature && (
        <CreaturePopup
          mode={isOwner ? "edit" : "view"}
          creature={activeCreature}
          onClose={() => setActiveCreature(undefined)}
          onSubmit={(name: string) =>
            handleUpdateCreature(activeCreature.id, name)
          }
          onDelete={() => handleDeleteCreature(activeCreature.id)}
        />
      )}
      {creatingItem && (
        <ItemPopup
          mode="create"
          onClose={() => setCreatingItem(false)}
          onSubmit={handleCreateItem}
        />
      )}
      {activeItem && (
        <ItemPopup
          mode={isOwner ? "edit" : "view"}
          item={activeItem}
          onClose={() => setActiveItem(undefined)}
          onSubmit={(name: string) => handleUpdateItem(activeItem.id, name)}
          onDelete={() => handleDeleteItem(activeItem.id)}
        />
      )}
    </div>
  );
}
