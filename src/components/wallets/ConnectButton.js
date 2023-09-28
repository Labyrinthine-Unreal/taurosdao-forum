import React, { useState, useEffect } from 'react';
import './Connect.css';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import faunadb from 'faunadb';

export default function Connect() {
  const [shortWallet, setWalletAddress] = useState();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { isOpen, onOpen, onClose } = useState(false); // Replace useDisclosure with useState
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
          <div className="connected-container">
            <div className="connected-wallet">
              <button onClick={onOpen}>{shortWallet}</button>
            </div>
            <button onClick={disconnect}> Disconnect</button>
          </div>
        </div>
      ) : (
        <div>
          <button className="connect-button" onClick={() => setIsOpen(true)}>
            Connect Wallet
          </button>
          <div className={`modal ${isOpen ? 'show' : ''}`}>
            <div className="modal-content">
              <div className="modal-header">
                <span className="modal-title">Connect Wallet</span>
                <button onClick={onClose} className="modal-close-button">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <button onClick={handleMM} className="connect-button">
                  Metamask
                </button>
                <button onClick={handleWC} className="connect-button">
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
