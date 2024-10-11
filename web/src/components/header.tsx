"use client";

import { useContext } from "react";
import Image from "next/image";

import { IdentityContext } from "@/app/lib/context/identity";
import LogoHero from "@/components/logo-hero";
import Profile from "@/components/profile";

import DiscordSvg from "@/images/icons/discord.svg";
import FacebookSvg from "@/images/icons/facebook.svg";
import TwitterSvg from "@/images/icons/twitter.svg";
import GithubSvg from "@/images/icons/github.svg";
import ListSvg from "@/images/icons/list.svg";

interface IProps {
  pageName: string;
}

export default function Header(props: IProps) {
  const identity = useContext(IdentityContext);

  return (
    <div className="flex items-stretch justify-between h-24 bg-grayscale-999">
      <div className="flex items-center gap-6 pl-6">
        <Image src={ListSvg} width={28} alt="List icon" />
        <LogoHero width={190} />
        <span className="text-2xl">{props.pageName}</span>
      </div>
      <div className="flex gap-8">
        <div className="flex items-center gap-6">
          <a
            href="https://discord.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image src={DiscordSvg} width={28} alt="Icon" />
          </a>
          <a
            href="https://twitter.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image src={TwitterSvg} width={28} alt="Icon" />
          </a>
          <a
            href="https://facebook.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image src={FacebookSvg} width={28} alt="Icon" />
          </a>
          <a
            href="https://github.com/pathmaster-gg"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image src={GithubSvg} width={28} alt="Icon" />
          </a>
        </div>
        <div className="flex">
          {identity.accountInfo && <Profile account={identity.accountInfo} />}
        </div>
      </div>
    </div>
  );
}
