import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { query as q } from "faunadb";

import { faunadb } from "../../../services/fauna";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: "read:user" //pega dados simples do user nome e avatar
    }),
  ],
  callbacks: {
    async session(session) {
      try {
        const userActiveSubscription = await faunadb.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_user_ref"),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("user_by_email"),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index("subscription_by_status"),
                "active"
              )
            ])
          )
        )

        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };
      } catch (err) {
        return {
          ...session,
          activeSubscription: null,
        }
      }
    },
    async signIn(user, account, profile) {
      const { email } = user;


      try {

        await faunadb.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index("user_by_email"),
                  q.Casefold(user.email),
                )
              )
            ),
            q.Create(
              q.Collection("users"),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index("user_by_email"),
                q.Casefold(user.email),
              ),
            )
          )
        )


        return true
      } catch (err) {
        return false;
      }

    },
  }
});


//JWT (Storage) coisas mais complexas
// Next AUTH (SOCIAL) coisa mais facil
// Cognito, Auth0 coisas mais complexas


 // jwt: {
  //   signingKey: process.env.PRIVATE_KEY chave gerada por comando.
  // },