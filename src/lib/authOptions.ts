import GithubProvider from "next-auth/providers/github";
import { getOrCreateUser } from "./dataService";

// Read allowed users from environment variable
const allowedUsers = process.env.NEXTAUTH_ALLOWED_USERS?.split(",") || [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authOptions: any = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user }: { user: any }) {
      // Restrict access to users in the allowedUsers list
      if (user.email && allowedUsers.includes(user.email)) {
        try {
          // Ensure user exists in Supabase users table
          await getOrCreateUser(user.email, user.name || undefined);
          return true;
        } catch (error) {
          console.error('Error creating/getting user in Supabase:', error);
          return false;
        }
      }
      return false;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user?: any }) {
      // If this is the first time the JWT is created (user object is available)
      if (user && user.email) {
        try {
          // Get the user from Supabase to include the ID in the token
          const supabaseUser = await getOrCreateUser(user.email, user.name || undefined);
          token.userId = supabaseUser.id;
        } catch (error) {
          console.error('Error getting user ID from Supabase:', error);
        }
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any }) {
      // Add the user ID to the session
      if (token.userId) {
        session.userId = token.userId as string;
      }
      return session;
    },
  },
};
