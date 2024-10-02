import Image from "next/image";

import DividorSvg from "@/images/divider.svg";

export default function Dividor() {
  return (
    <Image
      priority
      src={DividorSvg}
      alt="Horizontal divider"
      className="py-7"
      width={640}
    />
  );
}
