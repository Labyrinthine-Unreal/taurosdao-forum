import React, { useState, useEffect } from 'react';
import styles from './Connect.module.css'; // Import the CSS module
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import faunadb from 'faunadb';
import Link from 'next/link';

export default function Connect() {
  const ARTIST_NAME_QUERY = gql`
  query Artist($ethAddress: String!) {
    blockchain_by_id(_size: 100) {
      data(filter: { eth_address: { _eq: $ethAddress } }) {
        _id
        topic
        content
        user
        slug
        eth_address
      }
    }
  }
`;
  const [artistData, setArtistData] = useState(null);
  const [shortWallet, setWalletAddress] = useState();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false); // Replace useState with useDisclosure
  const { connectAsync } = useConnect();
  const q = faunadb.query;
  const client = new faunadb.Client({ secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, keepAlive: true });



  const { data: artistName, loading: artistPostsLoading, error: artistPostsError } = useQuery(ARTIST_NAME_QUERY, {
    variables: {
      ethAddress: artistData ? artistData.eth_address : null,
    },
    
  });
  console.log(artistName)


  useEffect(() => {
    console.log("Address to query:", address);
    client.query(
      q.Get(q.Match(q.Index('users_by_slug'), address))
    ).then((response) => {
      console.log("FaunaDB Response:", response);
      // Assuming the artist's bio is stored in the 'biography' field
      const username = response.data.user;
      setArtistData(username);
      console.log("Username:", username);
    })
    .catch((error) => {
      console.error("FaunaDB Error:", error);
    });
  }, [address]);


  const handleMM = async () => {
    const { account } = await connectAsync({ connector: new MetaMaskConnector() });
  };

  const handleWC = async () => {
    const chain = 'Ethereum'; // Initialize the chain variable
    const { account } = await connectAsync({
      connector: new WalletConnectConnector({
        chain,
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

  return (
    <div>
      {isConnected ? (
        <div>
          {/* Display user Address on Connect */}
          <div className={styles['connected-container']}>
            <div className={styles['connected-wallet']}>
            <button onClick={() => setIsOpen(true)}>
                <Link href="/">
                  {shortWallet}
                </Link>
              </button>
            </div>
            <button onClick={disconnect} className={styles['disconnect-button']}> Disconnect</button>
            <span className={styles['address-display']}>{artistData}</span>

          </div>
        </div>
      ) : (
        <div>
          {/* <button className={styles['connect-button']} onClick={() => setIsOpen(true)}>
            Connect Wallet
          </button> */}
          <div className={`modal ${isOpen ? styles['show'] : ''}`}>
            <div className={styles['modal-content']}>
              <div className={styles['modal-header']}>
                <span className={styles['modal-title']}>Connect Wallet</span>
                {/* <button onClick={() => setIsOpen(false)} className={styles['modal-close-button']}>
                  &times;
                </button> */}
              </div>
              <div className={styles['modal-body']}>
                <button onClick={handleMM} className={styles['connect-button']}>
                  <img src='/images/logos-icons/metamask.png' width="25px" height="25px" alt="MetaMask" />
                  Metamask
                </button>
                <button onClick={handleWC} className={styles['connect-button']}>
                  <img src='/images/logos-icons/WalletConnect.png' width="25px" height="20px" alt="WalletConnect" />
                  WalletConnect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
