import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

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
    // optional: restrict login to certain emails
    async signIn({ user }) {
      // Allow only specific email(s) if needed
      // return user.email === "youremail@example.com";
      return true; // allow all GitHub users
    },
  },
};
