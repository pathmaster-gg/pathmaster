"use client";

import { useState } from "react";

import Box from "@/components/box";
import Button from "@/components/button";
import Divider from "@/components/divider";
import Header from "@/components/header";
import { getServerUrl } from "@/lib/constants/env";
import { ChatAnswer } from "@/lib/models";

export default function ChatPage() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string | undefined>();

  const answerPars = answer ? answer.split("\n") : [];

  const handleSubmit = async () => {
    const response = await fetch(getServerUrl("/api/chat/ask"), {
      method: "POST",
      body: JSON.stringify({
        question,
      }),
    });
    const body = (await response.json()) as ChatAnswer;
    setAnswer(body.answer);
  };

  return (
    <div className="w-full min-h-full bg-mask-background">
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
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                  <Button text="Ask" onClick={handleSubmit} />
                </div>
                <Divider />
                <div className="w-full h-120 overflow-scroll px-6 flex flex-col gap-2 text-lg text-grayscale-200">
                  {answerPars.map((p) => (
                    <p key={p}>{p}</p>
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
