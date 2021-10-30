import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../../services/stripe";
import { getSession } from "next-auth/client";
import { faunadb } from "../../../services/fauna";
import { query as q } from "faunadb";

type User = {
  ref: {
    id: string
  },
  data: {
    stripe_costumer_id: string;
  }
}

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {

    const session = await getSession({ req: request });
    //pega o user no banco
    const user = await faunadb.query<User>(
      q.Get(
        q.Match(
          q.Index("user_by_email"),
          q.Casefold(session.user.email),
        )
      )
    )


    let constumerId = user.data.stripe_costumer_id

    //Salva um customer no stipe e a id do dele no banco fauna
    if (!constumerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        //metadata
      })

      await faunadb.query(
        q.Update(
          q.Ref(q.Collection("users"), user.ref.id),
          {
            data: { stripe_costumer_id: stripeCustomer.id }
          }
        )
      )

      constumerId = stripeCustomer.id;
    }

    //cria um stripeCheckoutSession
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: constumerId ,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        { price: "price_1JMKKfES69fwFMPmIgJPon2O", quantity: 1 },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCEESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    });


    return response.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method no allowed")
  }
}