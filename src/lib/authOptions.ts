import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

// Read allowed users from environment variable
const allowedUsers = process.env.NEXTAUTH_ALLOWED_USERS?.split(",") || [];

export const authOptions: AuthOptions = {
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
    async signIn({ user }) {
      // Restrict access to users in the allowedUsers list
      if (user.email && allowedUsers.includes(user.email)) {
        return true;
      }
      return false;
    },
  },
};
