"use client";

import Box from "@/components/box";
import Button from "@/components/button";
import Divider from "@/components/divider";
import Header from "@/components/header";

export default function ChatPage() {
  return (
    <div className="flex flex-col gap-4 pb-16">
      <Header pageName="Instant Q&A" />
      <div className="flex justify-center">
        <div className="flex flex-col grow max-w-screen-xl gap-4">
          <Box className="min-h-200 mt-8">
            <div className="flex flex-col items-center gap-8 p-6">
              <h3 className="text-3xl">PathMaster AI</h3>
              <div className="w-full max-w-200 flex flex-col items-center gap-4">
                <input
                  className="w-full px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
                  type="text"
                  placeholder="Ask me anything about Pathfinder"
                />
                <Button text="Ask" />
              </div>
              <Divider />
              <div className="w-full h-120 overflow-scroll px-6 flex flex-col gap-2 text-lg text-grayscale-200">
                <p>
                  In Pathfinder 2e, a module is a published adventure that takes
                  you and your party through a self-contained story with a clear
                  beginning, middle, and end. Modules are designed to guide you
                  through a specific narrative, providing a setting, NPCs, plot,
                  and obstacles to overcome.
                </p>
                <p>
                  Pathfinder 2e modules are often structured into several key
                  components:
                </p>
                <p>
                  1. <strong>Synopsis</strong>: A brief summary of the
                  adventure&apos;s plot and setting.
                </p>
                <p>
                  2. <strong>Setting</strong>: The world, environment, and
                  details about the location and climate.
                </p>
                <p>
                  3. <strong>Plot</strong>: The main storyline, including key
                  events, NPCs, and plot twists.
                </p>
                <p>
                  4. <strong>NPCs</strong>: Non-player characters, including
                  stat blocks, personalities, and motivations.
                </p>
                <p>
                  5. <strong>Adventures</strong>: The specific events and
                  encounters that make up the adventure&apos;s main arc.
                </p>
                <p>
                  6. <strong>Game Mechanics</strong>: Optional rules and
                  mechanics that can be used to make the adventure more
                  engaging.
                </p>
                <p>
                  7. <strong>Conclusion</strong>: The resolution of the
                  adventure, including any epilogue or wrap-up sections.
                </p>
                <p>
                  Modules can range from small, one-shot adventures to epic,
                  multichapter quests. They&apos;re a great way for new players
                  and new Game Masters (GMs) to experience the Pathfinder 2e
                  game system, or for veteran players and GMs to enjoy a new
                  storyline and challenges.
                </p>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
}
