import React, { useEffect, useState } from 'react';
import faunadb from 'faunadb';
import { useRouter } from 'next/router';
import Header from '@root/components/layout/Header';
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const q = faunadb.query;

// Define the GraphQL query outside the component
const ARTIST_POSTS_QUERY = gql`
  query ArtistPosts($ethAddress: String!) {
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

const client = new faunadb.Client({
  domain: "db.us.fauna.com",
  secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY,
  keepAlive: true,
});

export default function ArtistProfile() {
  const router = useRouter();
  const { slug, category } = router.query;
  const [artistData, setArtistData] = useState(null);

  const { data: artistPostsData, loading: artistPostsLoading, error: artistPostsError } = useQuery(ARTIST_POSTS_QUERY, {
    variables: {
      ethAddress: artistData ? artistData.eth_address : null,
    },
    
  });
  console.log(artistPostsData)
  

  useEffect(() => {
    if (slug) {
      client.query(
        q.Get(q.Match(q.Index('users_by_slug'), slug))
      ).then((response) => {
        // Assuming the artist's bio is stored in the 'biography' field
        const bio = response.data.biography;
        setArtistData(bio);

        const artistEthAddress = response.data.eth_address;

      });
    }
  }, [slug]);

  if (!artistData || artistPostsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <h1>Artist Bio</h1>
      <p>{artistData}</p>
      <h2>Artist's Posts</h2>
      <ul>
        {artistPostsData && artistPostsData.blockchain_by_id.data.map((post) => (
          <li key={post.id}>
            {/* Display the artist's post content */}
            {post.eth_address}
          </li>
        ))}
      </ul>
    </div>
  );
}
