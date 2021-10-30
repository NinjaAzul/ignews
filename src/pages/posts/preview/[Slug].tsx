import { GetStaticPaths, GetStaticProps } from "next"
import { useSession } from "next-auth/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";
import styles from "../post.module.scss";

interface PostPreviewProps {
  post: {
    Slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.Slug}`)
    }
  }, [session])


  return (

    <>
      <Head>
        <title>{post.title} | IgNews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div className={`${styles.postContent} ${styles.previewContent}`} dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 👨🏻‍🚀 for next level ...🚀</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}
//Gerar as páginas estáticas durante a build
//Gerar as páginas estáticas no primeiro acesso
//Metade de cada item ex: deixar statico os itens mais acessados. 30produtos.

export const getStaticPaths: GetStaticPaths = async () => {



  return {
    paths: [
      //{ params:{Slug:"serverle"}}
    ],
    fallback: "blocking",
    //true => tem um carregamento cliente,
    //false => não tem carregamento "quando já carreguei todos oque precisava", 
    //blocking => carrega no serverside Carrega Servidor. "não carrega todos caminhos".
  }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { Slug } = params;
  //console.log(Slug)


  const prismic = getPrismicClient()

  const response = await prismic.getByUID('publication', String(Slug), {})
  console.log(response)
  const post = {
    Slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }
  return {
    props: {
      post,
    },
    revalidate: 60 * 30, //30 minutos
  }

}