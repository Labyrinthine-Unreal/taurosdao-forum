// src/pages/index.js
import React from 'react';
import Head from 'next/head'
import Link from 'next/link';
import styles from '@root/styles/Home.module.css'
import { useAuth } from '@clerk/nextjs';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
import faunadb from 'faunadb';
import CategoryCard from '@root/components/CategoryCard';

const q = faunadb.query;

export default function Home(req, res) {
  const categories = [
    { title: 'General', link: '/categories/general', index: 0 },
    { title: 'Blockchain', link: '/categories/blockchain', index: 1 },
    { title: 'Game', link: '/categories/game', index: 2 },
    { title: 'Marketplace', link: '/categories/marketplace', index: 3 },
    { title: 'AI', link: '/categories/ai', index: 4 },
    { title: 'Forum', link: '/categories/forum', index: 5 }
  ];

  const categoryCardsRef = categories.map(() => React.createRef());

  const handleCardMouseEnter = (index) => {
    categoryCardsRef[index].current.classList.add(styles.cardHovered);
    categoryCardsRef[index].current.classList.add(styles[`cardRotate${['A', 'B', 'C', 'D'][index]}`]);
    categoryCardsRef.forEach((card, i) => {
      if (i !== index) {
        card.current.classList.add(styles[`nonHovered${['A', 'B', 'C', 'D'][i]}`]);
      }
    });
  };
  
  const handleCardMouseLeave = (index) => {
    categoryCardsRef[index].current.classList.remove(styles.cardHovered);
    categoryCardsRef[index].current.classList.remove(styles[`cardRotate${['A', 'B', 'C', 'D'][index]}`]);
    categoryCardsRef.forEach((card, i) => {
      if (i !== index) {
        card.current.classList.remove(styles[`nonHovered${['A', 'B', 'C', 'D'][i]}`]);
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
  const client = new faunadb.Client({ secret: "fnAFDZGm3pAASZlfCHemrt0fvXUPK1gb0ZqnbR6f", keepAlive: false });
  // const client = new faunadb.Client({ secret: process.env.REACT_APP_FAUNA_SECRET_manager, keepAlive: false });

  console.log(client)

  var createP = client.query(
    q.Create(
      q.Collection('user'),
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
        {categories.map((category) => (
            <CategoryCard
              key={category.index}
              ref={categoryCardsRef[category.index]}
              title={category.title}
              link={category.link}
              index={category.index}
              handleCardMouseEnter={handleCardMouseEnter}
              handleCardMouseLeave={handleCardMouseLeave}
            />
          ))}
        </div>
    </div>
  );
}
