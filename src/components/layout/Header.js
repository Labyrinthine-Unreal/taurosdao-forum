// src/pages/index.js
import React from 'react';
import Head from 'next/head'
import styles from './Header.module.css'
import { useAuth } from '@clerk/nextjs';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
import faunadb from 'faunadb';
import { Box, Flex, Link, Button, Image, Spacer, IconButton } from "@chakra-ui/react";
import { FaTwitter, FaInstagram, FaDiscord } from "react-icons/fa";
import Connect from "../wallets/ConnectButton";

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
  const client = new faunadb.Client({ domain: "db.us.fauna.com", secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, keepAlive: true });
  // const client = new faunadb.Client({ domain:"db.us.fauna.com", secret: process.env.REACT_APP_FAUNA_SECRET_manager, keepAlive: true });

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
        <Connect />
      </header>

      <SignedIn>
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <Flex
        as="header"
        position="sticky"
        top="0"
        bg="black"
        color="white"
        px="28"
        py="4"
        align="center"
        justify="space-between"
        zIndex={2}
      >
        <Box>
          {/* <Image src="/images/logos/TaurosDAO-logo.png" width="300px" height="auto" alt="TaurosDAO Logo" /> */}
        </Box>
        <Spacer />
        <Box>
          <IconButton as="a" href="https://twitter.com/taurosdao" target="blank" aria-label="Twitter" icon={<FaTwitter />} mx="1" variant="ghost" isRound={true} fontSize="26px" _hover={{ color: "teal" }} />
          <IconButton as="a" href="https://instagram.com/taurosdao" target="blank" aria-label="Instagram" icon={<FaInstagram />} mx="1" variant="ghost" isRound={true} fontSize="26px" _hover={{ color: "teal" }} />
          <IconButton as="a" href="https://discord.com/invite/taurosdao" target="blank" aria-label="Discord" icon={<FaDiscord />} mx="1" variant="ghost" isRound={true} fontSize="26px" _hover={{ color: "teal" }} />
        </Box>
        <Spacer />
        {/* <Button background="linear-gradient(45deg, #FFD700, #DAA520)" color="black" _hover={{background: "linear-gradient(45deg, #DAA520, #FFD700)"}} ml="4">Connect</Button> */}
        {/* <Connect /> */}
      </Flex>
      {/* <Connect /> */}
    </div>
  );
}
