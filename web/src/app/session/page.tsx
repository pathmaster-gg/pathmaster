"use client";

import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import AdventurePartCard from "@/components/adventure-part-card";
import DualListItem from "@/components/dual-list-item";
import Header from "@/components/header";
import List from "@/components/list";
import ListItem from "@/components/list-item";
import ObjectivesBox from "@/components/objectives-box";
import PartyBox from "@/components/party-box";
import {
  Adventure,
  AdventureCreature,
  AdventureItem,
  GameSession,
} from "@/lib/models";
import { IdentityContext } from "../lib/context/identity";
import { getServerUrl } from "@/lib/constants/env";
import TextEditPopup from "@/components/text-edit-popup";
import CreaturePopup from "@/components/creature-popup";
import ItemPopup from "@/components/item-popup";
import PlayerPopup from "@/components/player-popup";

export default function LiveSession() {
  const identity = useContext(IdentityContext);

  const searchParams = useSearchParams();

  const id = parseInt(searchParams.get("id") as string);

  const [session, setSession] = useState<GameSession | undefined>();
  const [adventure, setAdventure] = useState<Adventure | undefined>();
  const [editingGmNotes, setEditingGmNotes] = useState<boolean>(false);
  const [activeCreature, setActiveCreature] = useState<
    AdventureCreature | undefined
  >();
  const [activeItem, setActiveItem] = useState<AdventureItem | undefined>();

  const handleSetQuestFinished = async (questId: number, finished: boolean) => {
    await fetch(getServerUrl(`/api/session/${id}/finished_quest/${questId}`), {
      method: finished ? "PUT" : "DELETE",
      headers: {
        Authorization: `Bearer ${identity.session!.token}`,
      },
    });

    await loadSession();
  };

  const handleGmNotesEdit = async (value: string) => {
    await fetch(getServerUrl(`/api/session/${id}`), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${identity.session!.token}`,
      },
      body: JSON.stringify({
        notes: value,
      }),
    });

    setEditingGmNotes(false);

    await loadSession();
  };

  const loadSession = async () => {
    if (identity.session) {
      const sessionResponse = await fetch(getServerUrl(`/api/session/${id}`), {
        headers: {
          Authorization: `Bearer ${identity.session.token}`,
        },
      });
      const sessionBody = (await sessionResponse.json()) as GameSession;

      setSession(sessionBody);
    }
  };

  const loadAdventure = async (id: number) => {
    const adventureResponse = await fetch(getServerUrl(`/api/adventure/${id}`));
    const adventureBody = (await adventureResponse.json()) as Adventure;

    setAdventure(adventureBody);
  };

  const notesPars: string[] | undefined = session
    ? session.notes
      ? session.notes.split("\n")
      : []
    : undefined;

  useEffect(() => {
    loadSession();
  }, [identity.session]);

  useEffect(() => {
    if (session && !adventure) {
      loadAdventure(session.adventure.id);
    }
  }, [session]);

  return (
    <div className="flex flex-col gap-4 pb-16">
      <Header pageName="Game Session" />
      <div className="flex justify-center">
        <div className="flex flex-col grow max-w-screen-xl gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl">{session?.name ?? ""}</h2>
            <p className="text-lg">[{session?.adventure.name ?? ""}]</p>
          </div>
          <div className="grid grid-cols-4 gap-x-4">
            <PartyBox players={session?.players} />
            <ObjectivesBox
              quests={adventure?.quests}
              finished={session?.finished_quests ?? []}
              onFinish={(id: number) => handleSetQuestFinished(id, true)}
              onUnfinish={(id: number) => handleSetQuestFinished(id, false)}
            />
          </div>
          <div className="grid grid-cols-3 gap-x-4">
            <AdventurePartCard
              className="col-span-2"
              title="GM Notes"
              large
              button="edit"
              onEdit={() => setEditingGmNotes(true)}
            >
              {notesPars &&
                notesPars.map((p) => (
                  <p key={p} className="px-6">
                    {p}
                  </p>
                ))}
            </AdventurePartCard>
            <AdventurePartCard title="Events" large button="add">
              <List>
                {session &&
                  session.events.map((item) => {
                    const time = new Date(item.timestamp * 1000);
                    const minute = time.getMinutes().toString();

                    return (
                      <DualListItem
                        key={item.id}
                        left={`${time.getHours()}:${minute.length === 1 ? `0${minute}` : minute}`}
                        right={item.name}
                      />
                    );
                  })}
              </List>
            </AdventurePartCard>
          </div>
          <div className="grid grid-cols-3 gap-x-4">
            <AdventurePartCard title="NPCs">
              <List>
                {session &&
                  adventure &&
                  adventure.npcs.map((npc) => (
                    <ListItem
                      key={npc.id}
                      content={npc.name}
                      asterisk={
                        !!session.npc_notes.find(
                          (note) => note.npc_id === npc.id,
                        )
                      }
                    />
                  ))}
              </List>
            </AdventurePartCard>
            <AdventurePartCard title="Creatures">
              <List>
                {adventure &&
                  adventure.creatures.map((creature) => (
                    <ListItem
                      key={creature.id}
                      content={creature.name}
                      onClick={() => setActiveCreature(creature)}
                    />
                  ))}
              </List>
            </AdventurePartCard>
            <AdventurePartCard title="Items">
              <List>
                {adventure &&
                  adventure.items.map((item) => (
                    <ListItem
                      key={item.id}
                      content={item.name}
                      onClick={() => setActiveItem(item)}
                    />
                  ))}
              </List>
            </AdventurePartCard>
          </div>
        </div>
      </div>
      {session && editingGmNotes && (
        <TextEditPopup
          title="Edit GM Notes"
          prompt="Make some notes about the session:"
          onClose={() => setEditingGmNotes(false)}
          initValue={session.notes ?? ""}
          onSubmit={handleGmNotesEdit}
        />
      )}
      {activeCreature && (
        <CreaturePopup
          mode="view"
          creature={activeCreature}
          onClose={() => setActiveCreature(undefined)}
        />
      )}
      {activeItem && (
        <ItemPopup
          mode="view"
          item={activeItem}
          onClose={() => setActiveItem(undefined)}
        />
      )}
      <PlayerPopup />
    </div>
  );
}
