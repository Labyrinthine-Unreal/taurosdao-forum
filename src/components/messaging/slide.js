import React, { useState } from 'react';
import faunadb from 'faunadb';
import { useAccount, useEnsAvatar, useDisconnect, useConnect } from 'wagmi'

const q = faunadb.query;
const client = new faunadb.Client({
    domain: "db.us.fauna.com",
    secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY,
    keepAlive: true,
});

export default function DMSlide() {
    const [receiverEthAddress, setReceiverEthAddress] = useState();
    const [messageContent, setMessageContent] = useState('');
    const { address, isConnected } = useAccount()
    console.log(address)

    const sendMessage = async () => {
        try {
            // Log the recipient's Ethereum address for debugging
            console.log('Recipient Ethereum Address:', receiverEthAddress);
    
            // Find the recipient's FaunaDB document by Ethereum address
            const recipientDoc = await client.query(
                q.Get(q.Match(q.Index('users_by_slug'), receiverEthAddress))
            );
    
            if (!recipientDoc || !recipientDoc.ref) {
                console.error('Recipient not found');
                return;
            }
    
            // Create the message with sender and receiver references
            const message = {
                senderRef: q.Ref(q.Collection('users'), address), // Use the actual sender's Ethereum address
                receiverRef: recipientDoc.ref, // Use the FaunaDB reference
                content: messageContent,
                timestamp: new Date().toISOString(),
            };
    
            // Create a new message document in the "Messages" collection
            const response = await client.query(
                q.Create(
                    q.Collection('Messages'),
                    { data: message }
                )
            );
    
            console.log('Message sent:', response.data);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    

    return (
        <div>
            <h1>Send a Direct Message</h1>
            <div>
                <label htmlFor="receiverEthAddress">Recipient Ethereum Address:</label>
                <textarea
                    id="receiverEthAddress"
                    value={receiverEthAddress}
                    onChange={(e) => setReceiverEthAddress(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="messageContent">Message:</label>
                <textarea
                    id="messageContent"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                />
            </div>
            <div>
                <button onClick={sendMessage}>Send Message</button>
            </div>
        </div>
    );
}
