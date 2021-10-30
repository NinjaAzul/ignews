import Head from "next/head";
import { GetStaticProps } from "next";
import { SubscribeButton } from "../components/SubscribeButton";
import styles from "../styles/pages/home.module.scss";
import { stripe } from "../services/stripe";
import Image from "next/image";

//Client-Side => api commum => Dinamic component
//Server-Side => SSR => Content Dinamic performace
//Static => SSG => STATIC


interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.News</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>🖐🏻 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publication <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>
        <Image src="/images/avatar.svg" alt="Github Coding" objectFit="cover" width={336} height={521} />
      </main>
    </>
  )
}
//SSR => getServerSideProps: GetServerSideProps => chamada api pelo node ante de gerar pagina statica porém chama a pagina em todos reloading: usado se a informação muda muito.
//SSG => getStaticsProps: GetStaticProps => chamada api que podemos controlar quando refazer a chamada, assim não ficamos refazendo a chamada se o dado não ter muita mudança.
export const getStaticProps: GetStaticProps = async () => {

  const price = await stripe.prices.retrieve("price_1JMKKfES69fwFMPmIgJPon2O");
   // expand: ['product'],

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };
  
  return {
    props: {
      product,
    },
    revalidate:  60 * 60 * 24 // 24 horas
  }
}