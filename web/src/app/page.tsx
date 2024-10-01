"use client";

import { useContext } from "react";

import {
  OAUTH_GOOGLE_CALLBACK,
  OAUTH_GOOGLE_CLIENT_ID,
} from "@/lib/constants/env";
import { IdentityContext } from "./lib/context/identity";

export default function Home() {
  const identity = useContext(IdentityContext);

  const scopes = ["https://www.googleapis.com/auth/userinfo.email"];

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {identity.accountInfo ? (
            <p>Welcome back, {identity.accountInfo.username}</p>
          ) : (
            <a
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${OAUTH_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(OAUTH_GOOGLE_CALLBACK)}&response_type=code&scope=${encodeURIComponent(scopes.join(","))}`}
              rel="noopener noreferrer"
            >
              Login with Google
            </a>
          )}
        </div>
      </main>
    </div>
  );
}
