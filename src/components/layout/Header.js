// src/pages/index.js
import React from 'react';
import Head from 'next/head'
import styles from './Header.module.css'
import { useAuth } from '@clerk/nextjs';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
import faunadb from 'faunadb';
// import { Box, Flex, Link, Button, Image, Spacer, IconButton } from "@chakra-ui/react";
import { FaTwitter, FaInstagram, FaDiscord } from "react-icons/fa";
// import Connect from "../wallets/ConnectButton";
import { Box, Center, Icon,Flex, Button, Image,IconButton, Divider, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Spacer } from '@chakra-ui/react'
// import styles from '../../styles/SignIn.module.css'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { configureChains, } from 'wagmi'
import { mainnet, goerli,sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from 'wagmi/providers/infura'
import { AiOutlineWallet } from 'react-icons/ai'
import { useState, useEffect } from 'react';
import { useAccount, useEnsAvatar, useDisconnect, useConnect } from 'wagmi'

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
  // const client = new faunadb.Client({ domain:"db.us.fauna.com", secret: process.env.REACT_APP_FAUNA_SECRET_manager, keepAlive: true });

  // console.log(client)
  const [shortWallet, setWalletAddress] = useState();
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { connectAsync } = useConnect()
  const q = faunadb.query;

  const { chains } = configureChains(
    [mainnet],
    [
      // alchemyProvider({ apiKey: 'hu9KmpMxud_8q6Tlskrt42zOpiGy-9xN' }),
      infuraProvider({ apiKey: '4cb849430aaa4b82bb8360011eb397e9' }),
      publicProvider()
    ],
    // { targetQuorum: 2 },
  )

  const handleMM = async () => {
    const { account, chain } = await connectAsync({ connector: new MetaMaskConnector() });
  };

  const handleWC = async () => {
    const { account, chain } = await connectAsync({
      connector: new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
        },
      })
    })
  };

  // Sets state after authentication 
  useEffect(() => {
    if (address != null) {
      const sessionWallet = getShortenAddress(address);
      // window.localStorage.setItem('WALLET_ADDRESS', sessionWallet);
      setWalletAddress(sessionWallet);
      console.log(sessionWallet);
    }
  }, [address])

  // Shorten Address Display
  function getShortenAddress(address) {
    if (typeof address === "string") {
      const firstCharacters = address.substring(0, 6)
      const lastCharacters = address.substring(address.length - 4, address.length)
      return `${firstCharacters}...${lastCharacters}`;
    }
  }

  var createP = client.query(
    q.Create(
      q.Collection('users'),
      { data: { user:userId, name:user.firstName, eth_address:address } }
    )
  )
  createP.then(function (response) {
    // console.log(response.ref);
  })
  if (isConnected) {
    return (
      <div>
        {/* Display user Address on Connect */}
        {/* Style On Connect */}
        <Center>
          {<Center
            fontSize={14}
            fontWeight="semibold"
            bg="#009688bb"
            color="#fff"
            border="1px"
            _hover={{ bg: "teal.400" }}
            position="absolute"
            w="fit-content"
            h="40px"
            right={110}
            py={3}
            pl={3}
            pr={8}
            rounded="3xl"
          >
            <Icon display={{ base: "none", md: "flex" }} fontSize={17} fontWeight="semibold" mr={2} as={AiOutlineWallet} />
            {/* Display text 'Disconnect' next to Address (Green Bubble) */}
           {shortWallet}
          </Center>}
          <Button onClick={disconnect}> Disconnect</Button>

        </Center>
      </div>
    )
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>TaurosDAO Forum</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <div className={styles.title}>TaurosDAO</div>
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
        <IconButton as="a" href="https://twitter.com/taurosdao" target="blank" aria-label="Twitter" icon={<FaTwitter />} mx="1" variant="ghost" isRound={true} fontSize="26px" _hover={{ color: "teal" }} />
        <IconButton as="a" href="https://instagram.com/taurosdao" target="blank" aria-label="Instagram" icon={<FaInstagram />} mx="1" variant="ghost" isRound={true} fontSize="26px" _hover={{ color: "teal" }} />
        <IconButton as="a" href="https://discord.com/invite/taurosdao" target="blank" aria-label="Discord" icon={<FaDiscord />} mx="1" variant="ghost" isRound={true} fontSize="26px" _hover={{ color: "teal" }} />
      </Box>
      {/* <Button background="linear-gradient(45deg, #FFD700, #DAA520)" color="black" _hover={{background: "linear-gradient(45deg, #DAA520, #FFD700)"}} ml="4">Connect</Button> */}
      <Box className={styles.connect}>
      <Button onClick={onOpen}
      background="linear-gradient(45deg, #FFD700, #DAA520)" 
      color="black"
       _hover={{background: "linear-gradient(45deg, #DAA520, #FFD700)"}} 
       ml="4"
      >Connect Wallet</Button>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent rounded="2xl">
          <ModalHeader fontWeight="normal">Connect Wallet</ModalHeader>
          <Divider />
          <ModalCloseButton />
          <ModalBody py={10}>

            {/* Initialize MetaMask WAGMI providers connections */}
            <Button
              w="full"
              h="60px"
              justifyContent="left"
              variant="outline"
              borderColor="#008080"
              _hover={{ borderColor: '#000000' }}
              rounded="xl"
              fontWeight="normal"
              my={2}
              onClick={handleMM}
              leftIcon={<Image src='/images/logos-icons/metamask.png' w="2em" h="2em" mr="2" />}
            >
              Metamask
            </Button>

            {/* Initialize WalletConnect WAGMI providers connections */}
            <Button
              w="full"
              h="60px"
              justifyContent="left"
              variant="outline"
              borderColor="#008080"
              _hover={{ borderColor: '#000000' }}
              rounded="xl"
              fontWeight="normal"
              my={2}
              onClick={handleWC}
              leftIcon={<Image src='/images/logos-icons/WalletConnect.png' w="2em" h="2em" mr="2" />}
            >
              WalletConnect
            </Button>

          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>

    <div className={styles.avatar}>
          <UserButton />
        </div>

    <SignedIn>
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </Flex>
    </header>
    </div>
    
  );
}
