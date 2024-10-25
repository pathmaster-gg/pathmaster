"use client";

import { useContext, useEffect, useState } from "react";

import { IdentityContext } from "@/app/lib/context/identity";
import { AdventureMetadata, GameSessionMetadata, Session } from "@/lib/models";
import { getServerUrl } from "@/lib/constants/env";
import Box from "@/components/box";
import Header from "@/components/header";
import ProfileRow from "@/components/profile-row";
import SessionRow from "@/components/session-row";
import AdventureCover from "@/components/adventure-cover";
import AddButton from "@/components/add-button";

import ExampleAvatar from "@/images/example_avatar.png";
import Divider from "@/components/divider";

export default function Dashboard() {
  const identity = useContext(IdentityContext);

  const [sessions, setSessions] = useState<GameSessionMetadata[] | undefined>();
  const [adventures, setAdventures] = useState<
    AdventureMetadata[] | undefined
  >();

  const loadSessions = async (session: Session) => {
    const sessionsResponse = await fetch(getServerUrl("/api/session/mine"), {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });
    const sessionsBody = await sessionsResponse.json();
    setSessions(sessionsBody);
  };

  const loadAdventures = async (session: Session) => {
    const adventuresResponse = await fetch(
      getServerUrl("/api/adventure/mine"),
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      },
    );
    const adventuresBody = await adventuresResponse.json();
    setAdventures(adventuresBody);
  };

  useEffect(() => {
    if (identity.session) {
      loadSessions(identity.session);
      loadAdventures(identity.session);
    }
  }, [identity.session]);

  return (
    <div className="flex flex-col gap-8 pb-8">
      <Header pageName="Dashboard" />
      <div className="flex justify-center">
        <div className="flex grow items-start gap-6 max-w-screen-xl">
          <Box className="w-72">
            <div className="flex flex-col gap-6 p-5">
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
              <Divider />
              <div className="flex flex-col items-stretch gap-3">
                <ProfileRow
                  label="Adventures"
                  value={adventures ? adventures.length.toString() : "-"}
                />
                <ProfileRow
                  label="Sessions"
                  value={sessions ? sessions.length.toString() : "-"}
                />
              </div>
            </div>
          </Box>
          <div className="flex flex-col grow gap-6">
            <Box>
              <div className="p-5">
                <h2 className="text-2xl">Ongoing Sessions</h2>
                <div className="flex flex-col gap-4 mt-6">
                  {sessions &&
                    sessions.map((session) => (
                      <SessionRow
                        key={session.id}
                        sessionName={session.name}
                        adventureName={session.adventure.name}
                      />
                    ))}
                </div>
              </div>
            </Box>
            <Box>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl">Adventures</h2>
                  <AddButton link="/adventure/new" />
                </div>
                <div className="grid grid-cols-3 gap-y-10 mt-10">
                  {adventures &&
                    adventures.map((adventure) => (
                      <AdventureCover
                        key={adventure.id}
                        name={adventure.name}
                        image={getServerUrl(
                          `/api/image/${adventure.cover_image}`,
                        )}
                      />
                    ))}
                </div>
              </div>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}
