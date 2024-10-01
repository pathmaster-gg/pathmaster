"use client";

import { useContext, useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";

import { IdentityContext } from "../lib/context/identity";
import { getServerUrl } from "@/lib/constants/env";
import { Session } from "@/lib/models";

export default function Onboarding() {
  const router = useRouter();

  const identity = useContext(IdentityContext);

  const [username, setUsername] = useState<string>("");

  const handleSubmit = async (e: MouseEvent) => {
    e.preventDefault();

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
    router.push("/");
  };

  return (
    <div>
      <p>Welcome new user!</p>
      <form>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input type="submit" value="Continue" onClick={handleSubmit} />
      </form>
    </div>
  );
}
