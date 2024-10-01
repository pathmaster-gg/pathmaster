"use client";

import { Session } from "@/lib/models";
import { ReactNode, createContext, useEffect, useState } from "react";

const SESSION: string = "SESSION";

export const IdentityContext = createContext<Identity>({
  session: undefined,
  setSession: () => {},
});

interface Identity {
  session: Session | undefined;
  setSession: (value: Session | undefined) => void;
}

interface IdentityProviderProps {
  children: ReactNode;
}

export function IdentityProvider({ children }: IdentityProviderProps) {
  const [session, setSession] = useState<Session | undefined>(undefined);

  useEffect(() => {
    const rawSession = localStorage.getItem(SESSION);
    setSession(rawSession ? JSON.parse(rawSession) : undefined);
  }, []);

  const handleSetSession = (value: Session | undefined) => {
    setSession(value);

    if (value) {
      localStorage.setItem(SESSION, JSON.stringify(value));
    } else {
      localStorage.removeItem(SESSION);
    }
  };

  return (
    <IdentityContext.Provider
      value={{
        session,
        setSession: handleSetSession,
      }}
    >
      {children}
    </IdentityContext.Provider>
  );
}
