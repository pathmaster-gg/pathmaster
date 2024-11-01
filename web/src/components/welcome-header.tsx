"use client";

import { useContext } from "react";

import { IdentityContext } from "@/app/lib/context/identity";
import SignWithGoogleButton from "@/components/sign-in-with-google-button";
import Profile from "./profile";

interface IProps {
  button: boolean;
}

export default function WelcomeHeader(props: IProps) {
  const identity = useContext(IdentityContext);

  return (
    <div className="flex items-center justify-between mb-12">
      <span className="text-xl">ver. 0.1.0</span>
      {identity.accountInfo ? (
        <Profile account={identity.accountInfo} />
      ) : (
        props.button && <SignWithGoogleButton />
      )}
    </div>
  );
}
