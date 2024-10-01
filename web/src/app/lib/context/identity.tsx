"use client";

import { ReactNode, createContext, useEffect, useState } from "react";

import { getServerUrl } from "@/lib/constants/env";
import {
  AccountInfo as AccountInfoModel,
  Session,
  SessionType,
} from "@/lib/models";

const SESSION: string = "SESSION";

export const IdentityContext = createContext<Identity>({
  session: undefined,
  setSession: () => {},
  accountInfo: undefined,
});

interface Identity {
  session: Session | undefined;
  setSession: (value: Session | undefined) => void;
  accountInfo: AccountInfo | undefined;
}

interface AccountInfo {
  username: string;
}

interface IdentityProviderProps {
  children: ReactNode;
}

export function IdentityProvider({ children }: IdentityProviderProps) {
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | undefined>(
    undefined,
  );

  const fetchAccountInfo = async (session: Session) => {
    const accountInfoResponse = await fetch(getServerUrl("/api/account"), {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });
    const accountInfo = (await accountInfoResponse.json()) as AccountInfoModel;

    setAccountInfo({
      username: accountInfo.username,
    });
  };

  useEffect(() => {
    const rawSession = localStorage.getItem(SESSION);
    setSession(rawSession ? JSON.parse(rawSession) : undefined);
  }, []);

  useEffect(() => {
    if (session && session.type === SessionType.Normal) {
      fetchAccountInfo(session);
    } else {
      setAccountInfo(undefined);
    }
  }, [session]);

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
        accountInfo: accountInfo,
      }}
    >
      {children}
    </IdentityContext.Provider>
  );
}
