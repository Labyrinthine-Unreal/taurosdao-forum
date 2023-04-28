import { useAuth } from '@clerk/nextjs';
import faunadb from 'faunadb';
import React from 'react';
const q = faunadb.query;

export default function Faunath() {
  
  const { getToken } = useAuth();
  const [userId, setUserId] = React.useState();
  const makeQuery = async () => {
    try {
      // TODO: Update with your JWT template name
      const response = await fetch('https://db.fauna.com/', {
        method: 'POST',
        headers: {
          accept: 'application/json', 
          
        },})
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '*');
        const secret = await getToken({ template: 'fauna' });
        const client = new faunadb.Client({ secret, keepAlive: false });
        const id = await client.query(q.CurrentIdentity());
        setUserId(id);

    } catch (e) {
      // Handle error
      setUserId(null);
    }
  };
  return (
    <>
      <button onClick={makeQuery}>Make authenticated query</button>
      <p>User ID: {userId}</p>
    </>
  );
};