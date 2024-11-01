"use client";

import { useContext, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getServerUrl } from "@/lib/constants/env";
import { Session, SessionType } from "@/lib/models";
import { IdentityContext } from "@/app/lib/context/identity";
import Divider from "@/components/divider";
import Box from "@/components/box";
import LogoHero from "@/components/logo-hero";

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

    identity.setSession(session);

    if (session.type === SessionType.Onboarding) {
      // User logging in for the first time
      router.push("/onboarding");
    } else {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-12 py-8">
      <LogoHero width={400} />
      <div className="flex flex-col gap-8 w-156 my-8">
        <Divider />
        <Box extraMargin>
          <div className="w-full h-full flex items-center justify-center py-16">
            <p className="text-lg">Logging in with Google... </p>
          </div>
        </Box>
        <Divider />
      </div>
    </div>
  );
}
