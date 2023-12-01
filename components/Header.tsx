import { getServerSession } from "next-auth/next";
import SignOut from "@/components/SignOut";
import React from "react";
import Link from "next/link";

export default async function Header() {
  const session = await getServerSession();

  return (
    <header className="header">
      <h1><Link href="/">Lipsum</Link></h1>
      <nav>
        {session ? <SignOut/> : null}
      </nav>
    </header>
  );
}
