// src/pages/index.js
import React from 'react';
import Head from 'next/head'
import styles from './Header.module.css'
import { useAuth } from '@clerk/nextjs';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
import faunadb from 'faunadb';

const q = faunadb.query;

export default function Header(req, res) {
  
  const { user } = useUser()

  const { isLoaded, userId, sessionId, getToken } = useAuth();
  // console.log(getToken)

  // In case the user signs out while on the page.
  if (!isLoaded || !userId) {
    return null;
  }

  const secret = Clerk.session.getToken({ template: 'fauna' })
  // console.log(secret)
  const client = new faunadb.Client({ domain:"db.us.fauna.com", secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, keepAlive: true });
  // const client = new faunadb.Client({ domain:"db.us.fauna.com", secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, process.env.REACT_APP_FAUNA_SECRET_manager, keepAlive: true });

  // console.log(client)

  var createP = client.query(
    q.Create(
      q.Collection('user'),
      { data: { user: userId, name: user.firstName } }
    )
  )
  createP.then(function (response) {
    // console.log(response.ref);
  })

  return (
    <div className={styles.container}>
      <Head>
        <title>TaurosDAO Forum</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <div className={styles.title}>TaurosDAO</div>
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
    </div>
  );
}
