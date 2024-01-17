import Link from "next/link";

import { auth } from "@acme/auth";
import { Button } from "@acme/ui/button";

import { logoutAction } from "@/actions/logout";

export async function AuthShowcase() {
  const session = await auth();

  if (!session.user) {
    return (
      <>
        <Button size="lg" asChild>
          <Link href={"/auth/github"}>Sign in with Github</Link>
        </Button>
        <Button size="lg" asChild className="ml-2">
          <Link href={"/auth/discord"}>Sign in with Discord</Link>
        </Button>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        {session && <span>Logged in as {session.user.name}</span>}
      </p>
      <form action={logoutAction}>
        <Button size="lg">Sign out</Button>
      </form>
    </div>
  );
}
