import type { Metadata } from "next";

import "./globals.css";
import { IdentityProvider } from "./lib/context/identity";

import Background from "@/images/background.png";

export const metadata: Metadata = {
  title: "PathMaster",
  description: "Your trusted companion app for managing Pathfinder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <style>
          @import
          url(&#x27;https://fonts.googleapis.com/css2?family=Inknut+Antiqua:wght@300;400;500;600;700;800;900&amp;display=swap&#x27;);
        </style>
      </head>
      <body
        className="inknut-antiqua-regular antialiased h-full"
        style={{
          backgroundImage: `url(${Background.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <IdentityProvider>{children}</IdentityProvider>
      </body>
    </html>
  );
}
