import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.CLIENTE_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user",
        },
      },
    }),
    // ...add more providers here
  ],

  callbacks: {
    async session({ session }) {
      try {
        const userActiveSubscriptiuon = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_user_ref"),
                q.Select(
                  "ref",
                  q.Get(q.Match(q.Index("user_by_email"), session.user.email))
                )
              ),
              q.Match(q.Index("subscription_by_status"), "active"),
            ])
          )
        );

        return {
          ...session,
          activeSubscription: userActiveSubscriptiuon,
        };
      } catch (error) {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },
    async signIn({ user }) {
      try {
        const { email } = user;
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(q.Match(q.Index("user_by_email"), q.Casefold(email)))
            ),
            q.Create(q.Collection("users"), { data: { email } }),
            q.Get(q.Match(q.Index("user_by_email"), q.Casefold(email)))
          )
        );
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
});
