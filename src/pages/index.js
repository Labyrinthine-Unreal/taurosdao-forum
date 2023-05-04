// src/pages/index.js
import React from 'react';
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import styles from '@root/styles/Home.module.css'
import { useAuth } from '@clerk/nextjs';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
import faunadb from 'faunadb';

const q = faunadb.query;

export default function Home(req, res) {
  const categoryCardsRef = React.useRef([]);

  React.useEffect(() => {
    categoryCardsRef.current = categoryCardsRef.current.slice(0, 4); // Only consider the 4 category cards
  }, []);

  const handleCardMouseEnter = (index) => {
    categoryCardsRef.current[index].classList.add(styles.cardHovered);
    categoryCardsRef.current[index].classList.add(styles[`cardRotate${['A', 'B', 'C', 'D'][index]}`]);
    categoryCardsRef.current.forEach((card, i) => {
      if (i !== index) {
        card.classList.add(styles[`nonHovered${['A', 'B', 'C', 'D'][i]}`]);
      }
    });
  };

  const handleCardMouseLeave = (index) => {
    categoryCardsRef.current[index].classList.remove(styles.cardHovered);
    categoryCardsRef.current[index].classList.remove(styles[`cardRotate${['A', 'B', 'C', 'D'][index]}`]);
    categoryCardsRef.current.forEach((card, i) => {
      if (i !== index) {
        card.classList.remove(styles[`nonHovered${['A', 'B', 'C', 'D'][i]}`]);
      }
    });
  };
  

  const { user } = useUser()

  const { isLoaded, userId, sessionId, getToken } = useAuth();
  // console.log(getToken)

  // In case the user signs out while on the page.
  if (!isLoaded || !userId) {
    return null;
  }

  const secret = Clerk.session.getToken({ template: 'fauna' })
  console.log(secret)
  const client = new faunadb.Client({ secret: "fnAFClf-6BAATcIrDU1kFAR-2IpS1I3oRwlLYVAd", keepAlive: false });
  // const client = new faunadb.Client({ secret: process.env.REACT_APP_FAUNA_SECRET_manager, keepAlive: false });

  console.log(client)

  var createP = client.query(
    q.Create(
      q.Collection('test'),
      { data: { user: userId, name: user.firstName } }
    )
  )
  createP.then(function (response) {
    console.log(response.ref);
  })

  return (
    <div className={styles.container}>
      <Head>
        <title>Simple Forum</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <div className={styles.logo}>LOGO</div>
        <h1>Simple Forum</h1>
        <div className={styles.avatar}>
          <UserButton />
        </div>
      </header>

      <SignedIn>
        {/* Mount the UserButton component */}
      </SignedIn>
      <SignedOut>
        {/* Signed out users get sign in button */}
        <SignInButton />
      </SignedOut>
      {/* <div>Hello, {userId}</div>
      <div>{user.firstName}</div> */}
      <div className={styles.gridContainer}>
        <Link href="/categories/general">
          <div className={`${styles.categoryCard} ${styles.categoryTitle}`}
          onMouseEnter={() => handleCardMouseEnter(0)}
          onMouseLeave={() => handleCardMouseLeave(0)}
          ref={(el) => (categoryCardsRef.current[0] = el)}
          >
            <h2>General</h2>
          </div>
        </Link>
        <Link href="/categories/code">
          <div className={`${styles.categoryCard} ${styles.categoryTitle}`}
          onMouseEnter={() => handleCardMouseEnter(1)}
          onMouseLeave={() => handleCardMouseLeave(1)}
          ref={(el) => (categoryCardsRef.current[1] = el)}
          >
            <h2>Code</h2>
          </div>
        </Link>
        <Link href="/categories/design">
          <div className={`${styles.categoryCard} ${styles.categoryTitle}`}
          onMouseEnter={() => handleCardMouseEnter(2)}
          onMouseLeave={() => handleCardMouseLeave(2)}
          ref={(el) => (categoryCardsRef.current[2] = el)}
          >
            <h2>Design</h2>
          </div>
        </Link>
        <Link href="/categories/marketing">
          <div className={`${styles.categoryCard} ${styles.categoryTitle}`}
          onMouseEnter={() => handleCardMouseEnter(3)}
          onMouseLeave={() => handleCardMouseLeave(3)}
          ref={(el) => (categoryCardsRef.current[3] = el)}
          >
            <h2>Marketing</h2>
          </div>
        </Link>
        </div>
    </div>
  );
}
