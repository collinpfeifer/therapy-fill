import { useSession } from "vinxi/http";

export async function getSession() {
  return await useSession({
    password: process.env.SESSION_SECRET!,
  });
}
