import axios from "axios";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CognitoProvider from "next-auth/providers/cognito";

async function refreshAccessToken(token: JWT) {
  try {
    const url = `${process.env.COGNITO_DOMAIN_URL}/oauth2/token`;

    const response = await axios(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${process.env.COGNITO_CLIENT_ID}:${process.env.COGNITO_CLIENT_SECRET}`).toString("base64")}`,
      },
      data: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token?.account?.refresh_token ?? "",
      }),
    });

    const refreshedTokens = response.data;

    if (!response) {
      throw refreshedTokens;
    }

    return {
      ...token,
      account: {
        ...token.account,
        access_token: refreshedTokens.access_token,
        expires_at: Date.now() + refreshedTokens.expires_in * 1000,
        refresh_token:
          refreshedTokens.refresh_token ?? token?.account?.refresh_token,
      },
    };
  } catch (error) {
    console.error("Error refreshing access token", error);

    return {
      ...token,
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      id: "cognito",
      name: "Cognito",
      idToken: true,
      clientId: process.env.COGNITO_CLIENT_ID ?? "",
      clientSecret: process.env.COGNITO_CLIENT_SECRET ?? "",
      client: {
        token_endpoint_auth_method: "client_secret_basic",
      },
      checks: ["state", "nonce"],
      issuer: process.env.COGNITO_ISSUER ?? "",
      wellKnown: `${process.env.COGNITO_ISSUER ?? ""}/.well-known/openid-configuration`,
      authorization: {
        url: `${process.env.COGNITO_DOMAIN_URL ?? ""}/oauth2/authorize`,
        params: {
          scope: "openid email",
          response_type: "code",
          client_id: process.env.COGNITO_CLIENT_ID ?? "",
          redirect_uri: `${process.env.NEXTAUTH_URL ?? ""}/api/auth/callback/cognito`,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // @ts-expect-error
        token.account = account;
      }

      if (token.account?.expires_at && Date.now() < token.account?.expires_at) {
        return token;
      }

      const newData = await refreshAccessToken(token);

      if (newData.account) {
        //@ts-expect-error
        token.account = newData.account;
      }

      return token;
    },
    session({ token, session }) {
      if (token) {
        session.user = token;
      }

      return session;
    },
    async redirect() {
      return "/dashboard";
    },
  },
};
