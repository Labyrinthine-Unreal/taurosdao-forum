import React, { useState, useEffect } from 'react';
import styles from './Connect.module.css'; // Import the CSS module

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import faunadb from 'faunadb';

export default function Connect() {
  const [shortWallet, setWalletAddress] = useState();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false); // Replace useState with useDisclosure
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

  return (
    <div>
      {isConnected ? (
        <div>
          {/* Display user Address on Connect */}
          <div className={styles['connected-container']}>
            <div className={styles['connected-wallet']}>
              <button onClick={() => setIsOpen(true)}>{shortWallet}</button>
            </div>
            <button onClick={disconnect}> Disconnect</button>
          </div>
        </div>
      ) : (
        <div>
          <button className={styles['connect-button']} onClick={() => setIsOpen(true)}>
            Connect Wallet
          </button>
          <div className={`modal ${isOpen ? styles['show'] : ''}`}>
            <div className={styles['modal-content']}>
              <div className={styles['modal-header']}>
                <span className={styles['modal-title']}>Connect Wallet</span>
                <button onClick={() => setIsOpen(false)} className={styles['modal-close-button']}>
                  &times;
                </button>
              </div>
              <div className={styles['modal-body']}>
                <button onClick={handleMM} className={styles['connect-button']}>
                <img src='/images/logos-icons/metamask.png' width="65px" height="65px"/>
Metamask
                </button>
                <button onClick={handleWC} className={styles['connect-button']}>
                <img src='/images/logos-icons/WalletConnect.png' width="65px" height="65px" />

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
