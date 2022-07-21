import { loadStripe } from "@stripe/stripe-js";

export async function getStripejs() {
  const stripejs = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
  return stripejs;
}
