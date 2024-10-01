"use client";

import { useContext, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getServerUrl } from "@/lib/constants/env";
import { Session, SessionType } from "@/lib/models";
import { IdentityContext } from "@/app/lib/context/identity";

export default function Google() {
  const router = useRouter();

  const identity = useContext(IdentityContext);

  const searchParams = useSearchParams();

  const handleLogin = async () => {
    const code = searchParams.get("code");
    const loginResponse = await fetch(
      getServerUrl(`/api/oauth/google?code=${encodeURIComponent(code!)}`),
    );
    const session = (await loginResponse.json()) as Session;

    if (session.type === SessionType.Onboarding) {
      // User logging in for the first time
      identity.setSession(session);

      router.push("/onboarding");
    } else {
      throw new Error("not yet implemented");
    }
  };

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <div>
      <p>Logging in with Google</p>
    </div>
  );
}
