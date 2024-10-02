import Image from "next/image";

import SigninWithGoogleSvg from "@/images/signin_with_google.svg";

import {
  OAUTH_GOOGLE_CALLBACK,
  OAUTH_GOOGLE_CLIENT_ID,
} from "@/lib/constants/env";

export default function SignInWithGoogleButton() {
  const scopes = ["https://www.googleapis.com/auth/userinfo.email"];

  return (
    <a
      href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${OAUTH_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(OAUTH_GOOGLE_CALLBACK)}&response_type=code&scope=${encodeURIComponent(scopes.join(","))}`}
      rel="noopener noreferrer"
    >
      <Image
        priority
        src={SigninWithGoogleSvg}
        width={205}
        alt="Sign in with Google"
      />
    </a>
  );
}
