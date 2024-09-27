import { OAUTH_GOOGLE_CLIENT_ID, getServerUrl } from "@/lib/constants/env";

export default function Home() {
  const callbackUrl = getServerUrl("/api/oauth/google");
  const scopes = ["https://www.googleapis.com/auth/userinfo.email"];

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${OAUTH_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=${encodeURIComponent(scopes.join(","))}`}
            rel="noopener noreferrer"
          >
            Login with Google
          </a>
        </div>
      </main>
    </div>
  );
}
