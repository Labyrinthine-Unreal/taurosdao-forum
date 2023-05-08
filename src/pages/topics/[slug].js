// src/pages/topics/[slug].js
// import React from 'react';
// import { useRouter } from 'next/router';
// import { useQuery, gql } from '@apollo/client';
// import parse from 'html-react-parser';

// GraphQL query to fetch topic data based on the slug
// const GET_TOPIC_BY_SLUG = gql`
//   query GetTopicBySlug($slug: String!) {
//     getTopicBySlug(slug: $slug) {
//       _id
//       topic
//       content
//       slug
//     }
//   }
// `;

// const TopicPage = () => {
//   const router = useRouter();
//   const { slug } = router.query;

  // Fetch the topic data based on the slug using Apollo Client
  // const { data, loading, error } = useQuery(GET_TOPIC_BY_SLUG, {
  //   variables: { slug },
  //   skip: !slug, 
    // Skip the query if the slug is not available
  // });

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;

  // Render the topic data
//   const topicData = data?.getTopicBySlug;

//   return (
//     <div>
//       <h1>Topic: {topicData?.topic}</h1>
//       <div>{parse(topicData?.content)}</div>
//     </div>
//   );
// };

// export default TopicPage;

// src/pages/topics/[slug].js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import faunadb from 'faunadb';
import parse from 'html-react-parser';

const client = new faunadb.Client({
  secret: 'fnAFC-8oHiAAUNEoQOqMs09rtY9ykV-6Z-iWUM9U',
});

const q = faunadb.query;

const TopicPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [topicData, setTopicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      const fetchData = async () => {
        try {
          const result = await client.query(
            q.Get(q.Match(q.Index('topics_by_slug'), slug))
          );
          setTopicData(result.data);
          setLoading(false);
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Topic: {topicData?.topic}</h1>
      <div>{parse(topicData?.content)}</div>
    </div>
  );
};

export default TopicPage;

