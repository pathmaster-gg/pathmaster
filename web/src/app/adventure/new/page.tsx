"use client";

import Box from "@/components/box";
import Button from "@/components/button";
import Divider from "@/components/divider";
import Header from "@/components/header";
import ImageUploader from "@/components/image-uploader";

export default function NewAdventure() {
  return (
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
                    className="flex-grow px-3 py-2 rounded text-black text-base"
                    type="text"
                    placeholder="Name of the new adventure"
                  />
                </div>
                <div className="flex flex-col gap-6">
                  <p className="text-sm">Cover Image</p>
                  <div className="flex justify-center">
                    <ImageUploader onImageIdChange={() => {}} />
                  </div>
                </div>
              </div>
            </div>
          </Box>
          <Divider />
        </div>
        <Button text="Create" onClick={() => {}} />
      </div>
    </div>
  );
}
