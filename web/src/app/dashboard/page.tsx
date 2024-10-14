"use client";

import { useContext } from "react";

import { IdentityContext } from "@/app/lib/context/identity";
import Box from "@/components/box";
import Header from "@/components/header";
import ProfileRow from "@/components/profile-row";
import SessionRow from "@/components/session-row";
import AdventureCover from "@/components/adventure-cover";

import ExampleAvatar from "@/images/example_avatar.png";
import CoverKingmaker from "@/images/cover_kingmaker.jpg";
import CoverHellknightHill from "@/images/cover_hellknight_hill.jpg";
import CoverPreyForDeath from "@/images/cover_prey_for_death.jpg";
import CoverRuinsOfGauntlight from "@/images/cover_ruins_of_gauntlight.jpg";
import CoverTheGreatToysHeist from "@/images/cover_the_great_toys_heist.jpg";

export default function Dashboard() {
  const identity = useContext(IdentityContext);

  return (
    <div className="flex flex-col gap-8 pb-8">
      <Header pageName="Dashboard" />
      <div className="flex justify-center">
        <div className="flex grow items-start gap-6 max-w-screen-xl">
          <Box className="w-72">
            <div className="flex flex-col gap-8 p-5">
              <h2 className="text-2xl">About</h2>
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-16 h-16 border border-highlight rounded-full"
                  style={{
                    backgroundImage: `url(${ExampleAvatar.src})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                ></div>
                <p className="text-sm">{identity.accountInfo?.username}</p>
              </div>
              <div className="flex flex-col items-stretch gap-3">
                <ProfileRow label="Adventures" value="9" />
                <ProfileRow label="Sessions" value="72" />
              </div>
            </div>
          </Box>
          <div className="flex flex-col grow gap-6">
            <Box>
              <div className="p-5">
                <h2 className="text-2xl">Ongoing Sessions</h2>
                <div className="flex flex-col gap-4 mt-6">
                  <SessionRow
                    sessionName="Session 64"
                    adventureName="Kingmaker"
                  />
                  <SessionRow
                    sessionName="The Iron Path"
                    adventureName="Age of Ashes - Hellknight Hill"
                  />
                  <SessionRow
                    sessionName="Echoes of Eternity"
                    adventureName="Prey for Death"
                  />
                  <SessionRow
                    sessionName="Session 3"
                    adventureName="Abomination Vaults - Ruins of Gauntlight"
                  />
                  <SessionRow
                    sessionName="Session 5"
                    adventureName="The Great Toy Heist"
                  />
                </div>
              </div>
            </Box>
            <Box>
              <div className="p-5">
                <h2 className="text-2xl">Adventures</h2>
                <div className="grid grid-cols-3 gap-y-10 mt-10">
                  <AdventureCover name="Kingmaker" image={CoverKingmaker} />
                  <AdventureCover
                    name="Hellknight Hill"
                    image={CoverHellknightHill}
                  />
                  <AdventureCover
                    name="Prey for Death"
                    image={CoverPreyForDeath}
                  />
                  <AdventureCover
                    name="Ruins of Gauntlight"
                    image={CoverRuinsOfGauntlight}
                  />
                  <AdventureCover
                    name="The Great Toys Heist"
                    image={CoverTheGreatToysHeist}
                  />
                </div>
              </div>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}
