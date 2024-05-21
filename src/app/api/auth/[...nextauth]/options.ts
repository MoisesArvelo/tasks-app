import { NextAuthOptions } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito"

export const authOptions: NextAuthOptions = {
    providers: [
        CognitoProvider({
            id: 'cognito',
            name: 'Cognito',
            idToken: true,
            clientId: process.env.COGNITO_CLIENT_ID ?? '',
            clientSecret: process.env.COGNITO_CLIENT_SECRET ?? '',
            client: {
                token_endpoint_auth_method: "client_secret_basic"
            },
            checks: ['state', 'nonce'],
            issuer: process.env.COGNITO_ISSUER ?? '',
            wellKnown: `${process.env.COGNITO_ISSUER ?? ''}/.well-known/openid-configuration`,
            authorization: {
                url: `${process.env.COGNITO_DOMAIN_URL ?? ''}/oauth2/authorize`,
                params: {
                scope: 'openid email',
                response_type: 'code',
                client_id: process.env.COGNITO_CLIENT_ID ?? '',
                redirect_uri: `${process.env.NEXTAUTH_URL ?? ''}/api/auth/callback/cognito`,
                },
            },
        })
    ],
    callbacks: {
        jwt({ token, account }) {
            if (account) {
                token.account = account;
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
            return '/dashboard';
        },
    
    },
}
