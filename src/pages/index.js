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
      <SignedIn>
        {/* Mount the UserButton component */}
        <UserButton />
      </SignedIn>
      <SignedOut>
        {/* Signed out users get sign in button */}
        <SignInButton />
      </SignedOut>
      {/* <div>Hello, {userId}</div>
      <div>{user.firstName}</div> */}
      <h1>Simple Forum</h1>
      <ul>
        <li>
          <Link href="/categories/general">
            <span className={styles.categoryLink}>General</span>
          </Link>
        </li>
        <li>
          <Link href="/categories/code">
            <span className={styles.categoryLink}>Code</span>
          </Link>
        </li>
        <li>
          <Link href="/categories/design">
            <span className={styles.categoryLink}>Design</span>
          </Link>
        </li>
        <li>
          <Link href="/categories/marketing">
            <span className={styles.categoryLink}>Marketing</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
