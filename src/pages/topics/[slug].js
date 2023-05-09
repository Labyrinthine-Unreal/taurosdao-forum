// src/pages/topics/[slug].js
import React from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import { useUser } from '@clerk/nextjs';
import parse from 'html-react-parser';
import Header from '@root/components/Header';
import styles from './TopicPage.module.css';

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

const TopicPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  // Fetch the topic data based on the slug using Apollo Client
  const { data, loading, error } = useQuery(GET_TOPIC_BY_SLUG, {
    variables: { slug },
    skip: !slug, 
    // Skip the query if the slug is not available
  }) 

  const { user } = useUser();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  // Render the topic data
  const topicData = data?.topics_by_slug.slug;
  console.log(data)
  console.log(data?.topics_by_slug.slug)

  // if (!data?.topics_by_slug) {
  //   return <h1>404: Not Found</h1>
  // }

  if (!topicData) {
    return <h1>404: Not Found</h1>
  }

  const isAuthor = user.username === topicData.user; // check if current user is the author


  return (
    <div>
      <Header/>
      <div className={styles.container}>
        <table className={styles.topicTable}>
          <tbody>
            <tr>
              <td className={styles.leftColumn}>
                <div>{topicData.user}</div>
                <div>Number of posts: 0</div>
                <div>Date Joined: N/A</div>
              </td>
              <td className={styles.rightColumn}>
              <div>{data?.topics_by_slug.topic}</div>
                <p className={styles.date}>19 February 2023, 22:09</p>
                <div>{parse(data?.topics_by_slug.content)}</div>
                {isAuthor && <button>Edit Topic</button>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopicPage;

