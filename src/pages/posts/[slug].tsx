import { GetServerSideProps, GetStaticProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { RichText } from "prismic-dom";
import { getPrismicCliente } from "../../services/prismic";
import styles from "../posts/post.module.scss";

interface postPrps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedEt: string;
  };
}
const post = ({ post }: postPrps) => {
  return (
    <>
      <Head>
        <title>{post.title} | ignews</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedEt}</time>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
};

export default post;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { slug } = params;
  const session = await getSession({ req });
  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const prismic = getPrismicCliente(req);
  type NewType = any;

  const response = await prismic.getByUID<NewType>(
    "PUBLICATION",
    String(slug),
    {}
  );

  const post = {
    slug,
    title: response.data.Title as string,
    content: RichText.asHtml(response.data.content),
    updatedEt: new Date(response.last_publication_date).toLocaleString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };
  return {
    props: {
      post,
    },
  };
};
