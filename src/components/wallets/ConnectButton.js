import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Image,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Center,
} from '@chakra-ui/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import faunadb from 'faunadb';

export default function Connect() {
  const [shortWallet, setWalletAddress] = useState();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { connectAsync } = useConnect();
  const q = faunadb.query;
  const client = new faunadb.Client({ secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, keepAlive: true });

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
      }),
    });
  };

  // Sets state after authentication
  useEffect(() => {
    if (address != null) {
      const sessionWallet = getShortenAddress(address);
      setWalletAddress(sessionWallet);
      console.log(sessionWallet);
    }
  }, [address]);

  // Shorten Address Display
  function getShortenAddress(address) {
    if (typeof address === 'string') {
      const firstCharacters = address.substring(0, 6);
      const lastCharacters = address.substring(address.length - 4, address.length);
      return `${firstCharacters}...${lastCharacters}`;
    }
  }

  var createP = client.query(
    q.Create(
      q.Collection('eth_address'),
      { data: { name: address } }
    )
  );
  createP.then(function (response) {
    console.log(response.ref);
  });

  if (isConnected) {
    return (
      <Box>
        {/* Display user Address on Connect */}
        <Center>
          <Center
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
            <Button onClick={onOpen}>{shortWallet}</Button>
          </Center>
          <Button onClick={disconnect}> Disconnect</Button>
        </Center>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        onClick={onOpen}
        bg="#FFD700"
        color="black"
        _hover={{ bg: "#DAA520" }}
        ml="4"
      >
        Connect Wallet
      </Button>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent rounded="2xl">
          <ModalHeader fontWeight="normal">Connect Wallet</ModalHeader>
          <Divider />
          <ModalCloseButton />
          <ModalBody py={10}>
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
              // leftIcon={<Image src='/images/logos-icons/metamask.png' w="2em" h="2em" mr="2" />}
              onClick={handleMM}
            >
              Metamask
            </Button>
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
              // leftIcon={<Image src='/images/logos-icons/WalletConnect.png' w="2em" h="2em" mr="2" />}
              onClick={handleWC}
            >
              WalletConnect
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
