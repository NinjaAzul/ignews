import { Stripe } from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import { stripe } from "../../../services/stripe";
import { saveSubscription } from "../_lib/manageSubscription";
/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === "string" ? Buffer.from(chunk) : chunk
    );
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false
  }
}

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);

    const secret = req.headers['stripe-signature']

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      )

    } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message} `)
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
          //  apenas pelo site case 'customer.subscription.created':

            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false,
            );

            break;

          case 'checkout.session.completed':
            const checkoutSession = event.data.object as Stripe.Checkout.Session;

            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            )

            break;
          default:
            throw new Error('unhandled event.')
        }
      } catch (err) {
        return res.json({ error: 'Webhook handler failed.' })
      }
    }

    res.json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }

}

// Card Test => 424242424242424242...

//Comando para escutar o webhook local 
// => stripe listen --forward-to localhost:3000/api/webhooks

// Event Example:

// info  - ready on http://localhost:3000
// Evento recebido {
//   id: 'evt_1JR0FXES69fwFMPmop8jJmT8',
//   object: 'event',
//   api_version: '2020-08-27',
//   created: 1629575582,
//   data: {
//     object: {
//       id: 'cs_test_b189KfLXnE5TFSVRL9gnDGl1pY71aAwDm9ARTn72VPID0cukJ7gPFR38Dl',        
//       object: 'checkout.session',
//       allow_promotion_codes: true,
//       amount_subtotal: 990,
//       amount_total: 990,
//       automatic_tax: [Object],
//       billing_address_collection: 'required',
//       cancel_url: 'http://localhost:3000/',
//       client_reference_id: null,
//       currency: 'usd',
//       customer: 'cus_K2vD8nWejk7Omb',
//       customer_details: [Object],
//       customer_email: null,
//       livemode: false,
//       locale: null,
//       metadata: {},
//       mode: 'subscription',
//       payment_intent: null,
//       payment_method_options: {},
//       payment_method_types: [Array],
//       payment_status: 'paid',
//       setup_intent: null,
//       shipping: null,
//       shipping_address_collection: null,
//       submit_type: null,
//       subscription: 'sub_K5Aad8kWWMATwN',
//       success_url: 'http://localhost:3000/posts',
//       total_details: [Object],
//       url: null
//     }
//   },
//   livemode: false,
//   pending_webhooks: 2,
//   request: { id: 'req_g7Fr2QAWiDwcDi', idempotency_key: null },
//   type: 'checkout.session.completed'
// }