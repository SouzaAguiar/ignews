import { GetStaticProps } from "next";
import Head from "next/head";
import { stripe } from "../services/stripe";
import { SubscribButton } from "../components/SubscribButton";
import styles from "./home.module.scss";
interface homeProps {
  product: {
    priceid: string;
    amount: number;
  };
}
export default function Home({ product }: homeProps) {
  return (
    <>
      <Head>
        <title>home | ig.news</title>
      </Head>

      <main className={styles.constainer}>
        <section className={styles.hero}>
          <span>👏 hey, welcome</span>
          <h1>
            {" "}
            News about the <span>react</span> world
          </h1>
          <p>
            {" "}
            Get accesss to all the bublications of the <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribButton priceid={product.priceid} />
        </section>
        <img src="/images/avatar.svg" alt="gril coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1L2KmmCL1p0GgJmCVlnlqPLZ");
  const product = {
    proceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 horas
  };
};
