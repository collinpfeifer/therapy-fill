import { useSession } from "vinxi/http";

export function getSession() {
  return useSession({
    password: process.env.SESSION_SECRET!,
  });
}
