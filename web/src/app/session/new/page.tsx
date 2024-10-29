"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Box from "@/components/box";
import Button from "@/components/button";
import Divider from "@/components/divider";
import Header from "@/components/header";
import AdventureCover from "@/components/adventure-cover";
import { Adventure, GameSessionMetadata } from "@/lib/models";
import { getServerUrl } from "@/lib/constants/env";
import { IdentityContext } from "@/app/lib/context/identity";

export default function NewSession() {
  const router = useRouter();

  const identity = useContext(IdentityContext);

  const searchParams = useSearchParams();
  const adventureId = parseInt(searchParams.get("adventure") as string);

  const [name, setName] = useState<string>("");
  const [adventure, setAdventure] = useState<Adventure | undefined>(undefined);

  const loadAdventure = async () => {
    const adventureResponse = await fetch(
      getServerUrl(`/api/adventure/${adventureId}`),
    );
    const adventureBody = await adventureResponse.json();
    setAdventure(adventureBody);
  };

  const handleCreate = async () => {
    if (identity.session) {
      const createResponse = await fetch(getServerUrl("/api/session"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${identity.session.token}`,
        },
        body: JSON.stringify({ name, adventure_id: adventureId }),
      });
      const createBody = (await createResponse.json()) as GameSessionMetadata;

      router.push(`/session/${createBody.id}`);
    }
  };

  useEffect(() => {
    loadAdventure();
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-8">
      <Header pageName="New Game Session" />
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-8 w-156 my-8">
          <Box extraMargin>
            <div className="flex flex-col p-8">
              <h2 className="text-xl mb-8">
                Name your game session and start playing:
              </h2>
              <div className="flex flex-col mb-4 gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-sm">Name</p>
                  <input
                    className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
                    type="text"
                    placeholder="Name of the new session"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-6">
                  <p className="text-sm">Featuring the adventure:</p>
                  <div className="flex justify-center">
                    {adventure && (
                      <AdventureCover
                        name={adventure.name}
                        image={getServerUrl(
                          `/api/image/${adventure.cover_image}`,
                        )}
                        link={`/adventure?id=${adventure.id}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Box>
          <Divider />
        </div>
        <Button text="Create" disabled={!name} onClick={handleCreate} />
      </div>
    </div>
  );
}
