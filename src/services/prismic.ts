import Prismic from "@prismicio/client";

export function getPrismicCliente(req?: unknown) {
  return Prismic.client(process.env.PRISMIC_API_URL, {
    req,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });
}
