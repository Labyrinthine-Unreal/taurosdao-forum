import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import styles from '@root/styles/Home.module.css'
import { useState } from 'react';
import { SignUp } from "@clerk/nextjs";
import { useAuth } from '@clerk/nextjs';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
import faunadb from 'faunadb';
import React from 'react';
const q = faunadb.query;
const cors = require('cors');

const corsOptions = {
  origin: '/',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200,
};

export default function Home(req,res) {
  const [topics, setTopics] = useState([]);
  const {isSignedIn, user } = useUser()
  const [setUserId] = React.useState();



  const { isLoaded, userId, sessionId, getToken } = useAuth();
  // console.log(getToken)
  
  // In case the user signs out while on the page.
  if (!isLoaded || !userId) {
    return null;
  }
  
  const secret = Clerk.session.getToken({ template: 'fauna' }) // => "eyJhbGciOiJSUzI1NiIsImtpZC..."
  console.log(secret)
  const client = new faunadb.Client({ secret:"fnAFClf-6BAATcIrDU1kFAR-2IpS1I3oRwlLYVAd", keepAlive: false });
  console.log(client)
  // const id = client.query(q.CurrentIdentity());

  var createUser = client.query(
    q.Create(
      q.Collection('test'),
      { data: { user: userId, name:user.firstName  } }
    )
  )
  createUser.then(function(response) {
    console.log(response.ref); // Logs the ref to the console.
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
      {/* <div>{getToken}</div> */}
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
