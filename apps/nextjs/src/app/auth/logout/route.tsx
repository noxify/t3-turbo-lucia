import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { lucia, validateRequest } from "@acme/auth";

export const revalidate = true;

export async function GET(): Promise<Response> {
  const { session } = await validateRequest();

  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/");
}
