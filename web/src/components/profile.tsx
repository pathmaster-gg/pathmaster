import { useContext, useState } from "react";
import { useRouter } from "next/navigation";

import { AccountInfo } from "@/lib/models";
import { IdentityContext } from "@/app/lib/context/identity";

import ExampleAvatar from "@/images/example_avatar.png";
import Link from "next/link";

interface IProps {
  account: AccountInfo;
}

export default function Profile(props: IProps) {
  const router = useRouter();

  const identity = useContext(IdentityContext);

  const [popupOpen, setPopupOpen] = useState<boolean>(false);

  const handleLogout = () => {
    identity.setSession(undefined);
    router.push("/");
  };

  return (
    <div className="relative flex flex-col items-center">
      <div
        className="z-50 h-full min-h-16 flex items-center px-8 gap-4 cursor-pointer hover:bg-white/10"
        onClick={() => setPopupOpen(!popupOpen)}
      >
        <div
          className="w-10 h-10 border border-highlight rounded-full"
          style={{
            backgroundImage: `url(${ExampleAvatar.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        ></div>
        <span className="text-sm select-none">{props.account.username}</span>
      </div>
      {popupOpen && (
        <div
          className="z-40 fixed w-full h-full top-0 left-0"
          onClick={() => setPopupOpen(false)}
        ></div>
      )}
      {popupOpen && (
        <div className="z-50 absolute box-border w-full max-w-48 -bottom-32 bg-background flex flex-col border border-highlight">
          <Link href="/dashboard" onClick={() => setPopupOpen(false)}>
            <div className="px-4 py-4 select-none hover:bg-white/10 active:bg-white/15">
              Dashboard
            </div>
          </Link>
          <div
            className="px-4 py-4 select-none cursor-pointer hover:bg-white/10 active:bg-white/15"
            onClick={handleLogout}
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
}
