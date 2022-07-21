import { GetStaticProps } from "next";
import Head from "next/head";
import styles from "./styles.module.scss";
import { getPrismicCliente } from "../../services/prismic";
import Prismic from "@prismicio/client";
import Link from "next/link";

type post = {
  slug: string;
  title: string;
  except: string;
  updatedEt: string;
};
interface postesProps {
  posts: post[];
}
const postes = ({ posts }: postesProps) => {
  return (
    <>
      <Head>
        <title>Posts | ignews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <a>
                <time>{post.updatedEt}</time>
                <strong>{post.title}</strong>
                <p>{post.except}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};
export default postes;

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicCliente();
  const response = await prismic.query<any>(
    [Prismic.Predicates.at("document.type", "PUBLICATION")],
    { fetch: ["title", "content"], pageSize: 100 }
  );

  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
      title: post.data.Title,
      except:
        post.data.content.find((slice) => slice.type === "paragraph")?.text ??
        "",
      updatedEt: new Date(post.last_publication_date).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };
  });

  return {
    props: { posts },
  };
};
