"use client";

import Box from "@/components/box";
import Button from "@/components/button";
import Divider from "@/components/divider";
import Header from "@/components/header";
import AdventureCover from "@/components/adventure-cover";

import ExampleCover from "@/images/cover_kingmaker.jpg";

export default function NewSession() {
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
                  />
                </div>
                <div className="flex flex-col gap-6">
                  <p className="text-sm">Featuring the adventure:</p>
                  <div className="flex justify-center">
                    <AdventureCover
                      name="Kingmaker"
                      image={ExampleCover}
                      link="/"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Box>
          <Divider />
        </div>
        <Button text="Create" />
      </div>
    </div>
  );
}
