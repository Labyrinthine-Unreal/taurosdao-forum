import { useAuth } from '@clerk/nextjs';
import faunadb from 'faunadb';
import React from 'react';

export default function Faunath() {
  const q = faunadb.query;
  const { getToken } = useAuth();
  const [userId, setUserId] = React.useState();
  const makeQuery = async () => {
    try {
      // TODO: Update with your JWT template name
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