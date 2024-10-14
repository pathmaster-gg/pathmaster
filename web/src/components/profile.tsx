import { AccountInfo } from "@/lib/models";

import ExampleAvatar from "@/images/example_avatar.png";

interface IProps {
  account: AccountInfo;
}

export default function Profile(props: IProps) {
  return (
    <div className="flex items-center px-8 gap-4 cursor-pointer hover:bg-background">
      <div
        className="w-10 h-10 border border-highlight rounded-full"
        style={{
          backgroundImage: `url(${ExampleAvatar.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      ></div>
      <span className="text-sm">{props.account.username}</span>
    </div>
  );
}
