"use client";

import AdventurePartCard from "@/components/adventure-part-card";
import DualListItem from "@/components/dual-list-item";
import Header from "@/components/header";
import List from "@/components/list";
import ListItem from "@/components/list-item";
import ObjectivesBox from "@/components/objectives-box";
import PartyBox from "@/components/party-box";

export default function LiveSession() {
  return (
    <div className="flex flex-col gap-4 pb-16">
      <Header pageName="Game Session" />
      <div className="flex justify-center">
        <div className="flex flex-col grow max-w-screen-xl gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl">Session 3</h2>
            <p className="text-lg">
              [Abomination Vaults - Ruins of Gauntlight]
            </p>
          </div>
          <div className="grid grid-cols-4 gap-x-4">
            <PartyBox />
            <ObjectivesBox />
          </div>
          <div className="grid grid-cols-3 gap-x-4">
            <AdventurePartCard
              className="col-span-2"
              title="GM Notes"
              large
              button="edit"
            >
              <p className="px-6">Content</p>
              <p className="px-6">Content</p>
              <p className="px-6">Content</p>
              <p className="px-6">Content</p>
            </AdventurePartCard>
            <AdventurePartCard title="Events" large button="add">
              <List>
                <DualListItem left="10:34" right="Game started" />
                <DualListItem left="10:56" right="Game ended" />
              </List>
            </AdventurePartCard>
          </div>
          <div className="grid grid-cols-3 gap-x-4">
            <AdventurePartCard title="NPCs">
              <List>
                <ListItem content="NPC 1" asterisk />
                <ListItem content="NPC 2" />
              </List>
            </AdventurePartCard>
            <AdventurePartCard title="Creatures">
              <List>
                <ListItem content="Creature 1" />
                <ListItem content="Creature 2" />
              </List>
            </AdventurePartCard>
            <AdventurePartCard title="Items">
              <List>
                <ListItem content="Item 1" />
                <ListItem content="Item 2" />
              </List>
            </AdventurePartCard>
          </div>
        </div>
      </div>
    </div>
  );
}
