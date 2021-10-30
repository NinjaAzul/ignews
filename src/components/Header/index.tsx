import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SigninButton } from "./SigninButton";
import styles from "./styles.module.scss";
import { ActiveLink } from "./ActiveLink";


export function Header() {
  //prefetch => pré carrega os asquivos.


  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <a>
            <Image src="/images/logo.svg" alt="logo" objectFit="cover" width={110} height={31} />
          </a>

        </Link>


        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a>Home</a>
          </ActiveLink>

          <ActiveLink activeClassName={styles.active} href="/posts" prefetch>
            <a>Posts</a>
          </ActiveLink>

        </nav>

        <SigninButton />
      </div>
    </header>
  )
}