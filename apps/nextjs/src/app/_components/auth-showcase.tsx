import Link from "next/link";

import { validateRequest } from "@acme/auth";
import { Button } from "@acme/ui/button";

export async function AuthShowcase() {
  const session = await validateRequest();

  if (!session.user) {
    return (
      <Button size="lg" asChild>
        <Link href={"/auth/github"}>Sign in with Github</Link>
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        {session && <span>Logged in as {session.user.name}</span>}
      </p>
      <Button size="lg" asChild>
        <Link href={"/auth/logout"}>Sign out</Link>
      </Button>
    </div>
  );
}
