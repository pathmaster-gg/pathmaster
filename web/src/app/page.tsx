"use client";

import Image from "next/image";

import LogoHero from "@/components/logo-hero";
import Divider from "@/components/divider";
import LinkButton from "@/components/link-button";
import SocialButton from "@/components/social-button";
import WelcomeHeader from "@/components/welcome-header";

import LogoPf2e from "@/images/logo_pf2e.png";
import JournalSvg from "@/images/icons/journals.svg";
import BoxesSvg from "@/images/icons/boxes.svg";
import DiscordSvg from "@/images/icons/discord.svg";
import FacebookSvg from "@/images/icons/facebook.svg";
import TwitterSvg from "@/images/icons/twitter.svg";
import GithubSvg from "@/images/icons/github.svg";

export default function Home() {
  return (
    <div className="flex-col px-12 py-8">
      <WelcomeHeader button={true} />
      <div className="flex flex-col items-center">
        <LogoHero width={600} />
        <Divider />
        <p className="text-xl">Your trusted companion app for managing</p>
        <Image priority src={LogoPf2e} width={430} alt="Pathfinder 2e logo" />
        <div className="flex mt-16 gap-x-16">
          <LinkButton href="/wiki" icon={JournalSvg} text="Rules & Guides" />
          <LinkButton href="/modules" icon={BoxesSvg} text="Adventure Hub" />
        </div>
        <div className="flex mt-12 gap-x-8">
          <SocialButton href="https://discord.com/" icon={DiscordSvg} />
          <SocialButton href="https://twitter.com/" icon={TwitterSvg} />
          <SocialButton href="https://facebook.com/" icon={FacebookSvg} />
          <SocialButton
            href="https://github.com/pathmaster-gg"
            icon={GithubSvg}
          />
        </div>
      </div>
    </div>
  );
}
