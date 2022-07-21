import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/managerSubcrition";

async function buffer(stream: Readable) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunks === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
export const config = {
  api: {
    bodyParser: false,
  },
};
const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);
export default async function webHooks(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const secret = req.headers["stripe-signature"];
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.log(error);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
    const { type } = event;
    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case "checkout.session.completed":
          case "customer.subscription.created":
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription;
            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              type === "customer.subscription.created"
            );
            break;

          case "checkout.session.completed":
            const checkoutsession = event.data
              .object as Stripe.Checkout.Session;
            await saveSubscription(
              checkoutsession.subscription.toString(),
              checkoutsession.customer.toString(),
              true
            );
            break;

          default:
            throw new Error(`Unexpected event type: ${type}`);
        }
      } catch (error) {
        return res.send(`Webhook handler failed`);
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader("ALLOW", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
//stripe listen --forward-to localhost:3000/api/webhooks
