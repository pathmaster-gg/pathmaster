"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";

import { IdentityContext } from "@/app/lib/context/identity";
import { getServerUrl } from "@/lib/constants/env";
import Box from "@/components/box";
import Button from "@/components/button";
import Divider from "@/components/divider";
import Header from "@/components/header";
import ImageUploader from "@/components/image-uploader";
import { AdventureMetadata } from "@/lib/models";

export default function NewAdventure() {
  const router = useRouter();

  const identity = useContext(IdentityContext);

  const [name, setName] = useState<string>("");
  const [coverImageId, setCoverImageId] = useState<number | undefined>();

  const handleCreate = async () => {
    if (identity.session) {
      const createResponse = await fetch(getServerUrl("/api/adventure"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${identity.session.token}`,
        },
        body: JSON.stringify({ name, cover_image_id: coverImageId }),
      });
      const createBody = (await createResponse.json()) as AdventureMetadata;

      router.push(`/adventure?id=${createBody.id}`);
    }
  };

  return (
    <div className="w-full min-h-full bg-mask-background">
      <div className="flex flex-col gap-8 pb-8">
        <Header pageName="New Adventure" />
        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-8 w-156 my-8">
            <Box extraMargin>
              <div className="flex flex-col p-8">
                <h2 className="text-xl mb-8">
                  Create a new adventure by setting a name and cover image.
                </h2>
                <div className="flex flex-col mb-4 gap-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm">Name</p>
                    <input
                      className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
                      type="text"
                      placeholder="Name of the new adventure"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-6">
                    <p className="text-sm">Cover Image</p>
                    <div className="flex justify-center">
                      <ImageUploader
                        imageId={coverImageId}
                        onImageIdChange={setCoverImageId}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Box>
            <Divider />
          </div>
          <Button
            text="Create"
            disabled={!name || !coverImageId}
            onClick={handleCreate}
          />
        </div>
      </div>
    </div>
  );
}
