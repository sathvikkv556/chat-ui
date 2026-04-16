import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export const getUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const user = verifyToken(token);
  return user;
};