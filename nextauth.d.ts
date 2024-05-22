// nextauth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

interface IUser extends DefaultUser {
  account?: SAccount;
}

declare module "next-auth" {
  interface User extends IUser {}

  interface Session {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}

interface SAccount {
  access_token: string;
  expires_at: number;
  provider: string;
  providerAccountId: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  type: string;
}
