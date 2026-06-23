import NextAuth, { Session, type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export function decodeExp(token: string) {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], "base64").toString());
    if (payload.exp) return payload.exp * 1000;
    if (payload.expires_in) return Date.now() + payload.expires_in * 1000;
    throw new Error('No expiration field found in JWT.')
}

async function refreshAccessToken(refreshToken: string, oldToken: any) {
    const res = await fetch(`${process.env.NEST_API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error("Refresh failed");

    const accessToken = data.access_token;
    if (!accessToken) throw new Error("Missing access_token");

    const expiresMs = decodeExp(accessToken);

    return {
        ...oldToken,
        access_token: accessToken,
        refresh_token: data.refresh_token ?? oldToken.refresh_token,
        expires_at: expiresMs,
        error: undefined,
    };
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials) {
                const res = await fetch(`${process.env.NEST_API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password
                    })
                });

                if (!res.ok) {
                    return null;
                }

                const data = await res.json();

                const { user, access_token, refresh_token } = data;
                const expires_at = decodeExp(access_token);
                if (isNaN(expires_at)) throw new Error('Invalid token expiration.');

                return {
                    id: user.id,
                    access_token,
                    refresh_token,
                    expires_at
                }
            }
        })
    ],
    callbacks: {
        async jwt({ user, token }: any) {
            if (user) {
                return {
                    id: user.id,
                    access_token: user.access_token,
                    refresh_token: user.refresh_token,
                    expires_at: user.expires_at,
                }
            }

            if (token.expires_at > Date.now()) return token;

            return await refreshAccessToken(token.refresh_token, token);
        },
        
        async session({ session, token }: { session: Session, token: any }) {
            session.user.id = token.id;
            session.accessToken = token.access_token;
            session.refreshToken = token.refresh_token;
            return session;
        },
    },
    pages: {
        signIn: '/login'
    },
    session: {
        strategy: 'jwt'
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }