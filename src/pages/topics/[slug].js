// src/pages/topics/[slug].js
import React from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import parse from 'html-react-parser';

// GraphQL query to fetch topic data based on the slug
// const GET_TOPIC_BY_SLUG = gql`
// query TopicBySlug{
//   topics_by_slug{
//     data {
//       _id
//       user
//       topic 
//       content
//       slug
//     }
//   }
//  }
// `;

const GET_TOPIC_BY_SLUG = gql`
query MyTopicQuery($slug: String!){
  topics_by_slug(slug: $slug) {
    
    
    _id
    slug
    topic
    content
    
    }
    }
    
`;
// console.log(GET_TOPIC_BY_SLUG)

const TopicPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  // Fetch the topic data based on the slug using Apollo Client
  const { data, loading, error } = useQuery(GET_TOPIC_BY_SLUG, {
    variables: { slug },
    skip: !slug, 
    // Skip the query if the slug is not available
  }) 
  // console.log(data)
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  // Render the topic data
  const topicData = data?.topics_by_slug.slug;
  console.log(data)
  console.log(data?.topics_by_slug.slug)

  // if (!data?.topics_by_slug) {
  //   return <h1>404: Not Found</h1>
  // }

  return (
    <div>
      
          {/* {slug} */}
      <h1>Slug: {data?.topics_by_slug.slug}</h1>
      <h1>Topic: {data?.topics_by_slug.topic}</h1>
      <h1>content: {data?.topics_by_slug.content}</h1>

      {/* <div>{parse(String(data.topics_by_slug.slug))}</div> */}
      {/* <h1>{data.topics_by_slug.content}</h1> */}
      {/* <pre>{JSON.stringify(slug, null, 2)}</pre> */}
  
    </div>
  );
};

export default TopicPage;

// src/pages/topics/[slug].js
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import faunadb from 'faunadb';
// import parse from 'html-react-parser';

// const client = new faunadb.Client({
//   secret: 'fnAFDeAzz8AATcNvTlIEBNofmSNv25PdQqimuyCu',
//   domain: "db.us.fauna.com"
// });

// const q = faunadb.query;

// const TopicPage = () => {
//   const router = useRouter();
//   const { slug } = router.query;

//   const [topicData, setTopicData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   console.log(slug)

//   useEffect(() => {
//     if (slug) {
//       const fetchData = async () => {
//         try {
//           const result = await client.query(
//             q.Get(q.Match(q.Index('topics_by_slug'), slug))
//           );
//           setTopicData(result.data);
//           setLoading(false);
//           console.log(setTopicData(result.data))
//         } catch (error) {
//           setError(error);
//           setLoading(false);
//           // console.log(result)
//         }
//       };
//       fetchData();
//       console.log(fetchData)
//     }
//   }, [slug]);

  

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   return (
//     <div>
//       <h1>Topic: {topicData?.topic}</h1>
//       <div>{parse(topicData?.content)}</div>
//     </div>
//   );
// };

// export default TopicPage;

