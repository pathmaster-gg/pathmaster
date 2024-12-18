"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";

import { IdentityContext } from "../lib/context/identity";
import { getServerUrl } from "@/lib/constants/env";
import { Session } from "@/lib/models";
import WelcomeHeader from "@/components/welcome-header";
import LogoHero from "@/components/logo-hero";
import Divider from "@/components/divider";
import Box from "@/components/box";
import ValidationCheckbox, {
  CheckboxStatus,
} from "@/components/validation-checkbox";
import Button from "@/components/button";
import DiceButton from "@/components/dice-button";

export default function Onboarding() {
  const router = useRouter();

  const identity = useContext(IdentityContext);

  const [username, setUsername] = useState<string | undefined>();

  const handleSubmit = async () => {
    const onboardResponse = await fetch(getServerUrl("/api/account/onboard"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${identity.session?.token}`,
      },
      body: JSON.stringify({
        username,
      }),
    });
    const session = (await onboardResponse.json()) as Session;

    identity.setSession(session);
    router.push("/dashboard");
  };

  const handleDice = () => {
    const presetNames = [
      "ravenshallow",
      "kaelin-stormrider",
      "voren-bloodfang",
      "elira-moonwhisper",
      "dorin-ironfist",
    ];

    setUsername(presetNames[Math.floor(Math.random() * presetNames.length)]);
  };

  let lengthStatus = CheckboxStatus.Default;
  let compositionStatus = CheckboxStatus.Default;
  let endStatus = CheckboxStatus.Default;

  if (username !== undefined) {
    lengthStatus =
      username.length >= 3 && username.length <= 20
        ? CheckboxStatus.Checked
        : CheckboxStatus.Error;

    if (username === "") {
      compositionStatus = CheckboxStatus.Default;
      endStatus = CheckboxStatus.Default;
    } else {
      compositionStatus = username.match("^[a-z\\d\\-]*$")
        ? CheckboxStatus.Checked
        : CheckboxStatus.Error;
      endStatus =
        username.startsWith("-") || username.endsWith("-")
          ? CheckboxStatus.Error
          : CheckboxStatus.Checked;
    }
  }

  return (
    <div className="w-full min-h-full bg-mask-background">
      <div className="flex-col px-12 py-8">
        <WelcomeHeader button={false} />
        <div className="flex flex-col items-center">
          <LogoHero width={300} />
          <div className="flex flex-col gap-8 w-156 my-8">
            <Divider />
            <Box extraMargin>
              <div className="flex flex-col p-8">
                <h2 className="text-xl mb-8">
                  Welcome to PathMaster, Game Master!
                </h2>
                <p className="text-sm mb-8">
                  We need to set up your GM identity to help you save your game
                  sessions and adventures.
                </p>
                <div className="flex items-center mb-8 gap-4">
                  <input
                    className="flex-grow px-3 py-2 rounded text-black text-base bg-grayscale-200"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Please tell us your name"
                  />
                  <DiceButton onClick={handleDice} />
                </div>
                <ValidationCheckbox
                  status={lengthStatus}
                  text="Must be 3-20 characters"
                />
                <ValidationCheckbox
                  status={compositionStatus}
                  text="Lowercase letters, numbers, and hyphens only"
                />
                <ValidationCheckbox
                  status={endStatus}
                  text="Must not start or end with special characters"
                />
              </div>
            </Box>
            <Divider />
          </div>
          <Button
            text="Continue"
            onClick={handleSubmit}
            disabled={
              !(
                lengthStatus === CheckboxStatus.Checked &&
                compositionStatus === CheckboxStatus.Checked &&
                endStatus === CheckboxStatus.Checked
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
