"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { getServerUrl } from "@/lib/constants/env";

export default function Google() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState<string | undefined>(undefined);

  const handleLogin = async () => {
    const code = searchParams.get("code");
    const loginResponse = await fetch(
      getServerUrl(`/api/oauth/google?code=${encodeURIComponent(code!)}`),
    );
    const email = await loginResponse.text();
    setEmail(email);
  };

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <div>
      {email ? <p>Google Email: {email}</p> : <p>Logging in with Google</p>}
    </div>
  );
}
