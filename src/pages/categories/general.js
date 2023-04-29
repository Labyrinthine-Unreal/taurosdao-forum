// src/pages/categories/general.js
import { useState, useEffect } from 'react';
import { createTopic, getTopicsByCategory } from '@root/faunaClient';
import CreateTopic from '@root/components/CreateTopic';
import Link from 'next/link';
import faunadb from 'faunadb';
import React from 'react';
import { useAuth } from '@clerk/nextjs';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs';
import { GraphQLClient,gql } from 'graphql-request';
const q = faunadb.query;
const cors = require('cors');
const CLIENT_SECRET = "fnAFClf-6BAATcIrDU1kFAR-2IpS1I3oRwlLYVAd"
const FAUNA_GRAPHQL_BASE_URL = 'https://graphql.fauna.com/graphql'
// const GraphQLClient = new GraphQLClient(FAUNA_GRAPHQL_BASE_URL, {
//   headers:{
//     authorization: `Bearer ${CLIENT_SECRET}`
//   }
// })

// export const listTopics = () =>{
//   const query = gql`
//   query Entries(#size:)`
// }

const General = () => {
  const [topics, setTopics] = useState([]);

  


  // useEffect(() => {
  //   const fetchTopics = async () => {
  //     const fetchedTopics = await getTopicsByCategory('general');
  //     setTopics(fetchedTopics);
  //   };
  //   fetchTopics();
  // }, []);

  const handleNewTopic = async (newTopic) => {
    const topicId = await createTopic('general', newTopic.title, newTopic.content);
    if (topicId) {
      setTopics((prevTopics) => [...prevTopics, { ...newTopic, id: topicId }]);
    } else {
      console.error('Error creating topic');
    }
  };

  // In case the user signs out while on the page.
  // if (!isLoaded || !userId) {
  //   return null;
  // }
  
  const secret = Clerk.session.getToken({ template: 'fauna' }) // => "eyJhbGciOiJSUzI1NiIsImtpZC..."
  console.log(secret)
  const client = new faunadb.Client({ secret:"fnAFClf-6BAATcIrDU1kFAR-2IpS1I3oRwlLYVAd", keepAlive: false });
  console.log(client)
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  if (!isLoaded || !userId) {
    return null;
  }
  

 // Fetch questions
 const query =  client.query(
  q.Difference(
    //All questions
    q.Select('data', q.Map(
      q.Paginate(q.Documents(q.Collection('topics'))), q.Lambda('ref', q.Var('ref')))),
    // Attempted Questions
    q.Select('data', q.Map(
      q.Paginate( q.Match(q.Index('topics_by_id'), userId)),
      q.Lambda('topic_id', q.Ref(q.Collection('topics'), q.Var('topic_id')))
    ))
  )
)

var helper = client.paginate(
  q.Match(
    q.Index('topics_by_id'),
    'content'
  )
)
const help = helper.each(function(page) {
  // Logs the page's contents,
  // for example: [ Ref(Collection("test"), "1234"), ... ]
  console.log(page);
});

  return (
    <div>
      <h1>General Topics</h1>
      <CreateTopic onSubmit={handleNewTopic} />
      <ul>
        {/* {helper} */}
{/* {help} */}
        {/* {getPosts} */}
        {/* {topics.map((topic) => (
          <li key={topic.id}>
            <Link href={`/categories/topic/${encodeURIComponent(topic.id)}`}>
              <div>
                <h2>{topic.title}</h2>
                <p>
                  {topic.content.substring(0, 100)}
                  {topic.content.length > 100 ? '...' : ''} */}
                {/* </p>
              </div>
            </Link>
          </li>
        ))} */}
      </ul>
    </div>
  );
};

export default General;
