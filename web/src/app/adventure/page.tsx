import AdventurePartCard from "@/components/adventure-part-card";
import Box from "@/components/box";
import CarouselAdventure from "@/components/carousel-adventure";
import Header from "@/components/header";
import List from "@/components/list";
import ListItem from "@/components/list-item";

export default function AdventureDetails() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      <Header pageName="Adventure" />
      <div className="flex justify-center">
        <div className="flex flex-col grow max-w-screen-xl gap-6">
          <Box>
            <div className="p-8">
              <CarouselAdventure />
            </div>
          </Box>
          <div className="grid grid-cols-2 gap-x-6">
            <AdventurePartCard title="Background" large edit>
              <p className="px-6">
                When the mysterious Gauntlight, an eerie landlocked lighthouse,
                glows with baleful light, the people of Otari know something
                terrible is beginning. The town&apos;s newest heroes must
                venture into the ruins around the lighthouse and delve the
                dungeon levels far beneath it to discover the evil the
                Gauntlight heralds. Hideous monsters, deadly traps, and
                mysterious ghosts all await the heroes who dare to enter the
                sprawling megadungeon called the Abomination Vaults!
              </p>
            </AdventurePartCard>
            <AdventurePartCard title="Quests" large edit>
              <List>
                <ListItem content="Investigate the strange lights and magical disturbances emanating from the Gauntlight lighthouse." />
                <ListItem content="Find out why undead are emerging from the Gauntlight." />
              </List>
            </AdventurePartCard>
          </div>
          <div className="grid grid-cols-3 gap-x-6">
            <AdventurePartCard title="NPCs" edit>
              <List>
                <ListItem content="Otari Ilvashti" />
                <ListItem content="Wrin Sivinxi" />
                <ListItem content="Mayor Oseph Menhemes" />
                <ListItem content="Morlibint" />
              </List>
            </AdventurePartCard>
            <AdventurePartCard title="Creatures" edit>
              <List>
                <ListItem content="Corpselight" />
                <ListItem content="Flickerwisp" />
                <ListItem content="Morlock Scavenger" />
                <ListItem content="Morlock Engineer" />
              </List>
            </AdventurePartCard>
            <AdventurePartCard title="Items" edit>
              <List>
                <ListItem content="Mysterious Relic" />
                <ListItem content="Healing potion" />
                <ListItem content="Gold" />
              </List>
            </AdventurePartCard>
          </div>
        </div>
      </div>
    </div>
  );
}
