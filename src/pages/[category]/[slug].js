// src/pages/[category]/[slug].js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import { useUser } from '@clerk/nextjs';
import parse from 'html-react-parser';
import Header from '@root/components/layout/Header';
import styles from '../TopicPage.module.css';
import UpdateTopic from '@root/components/topicComponents/UpdateTopic';
import faunadb from 'faunadb';
import CommentList from '@root/components/commentComponents/CommentList';
import { CSSTransition } from 'react-transition-group';
import ReplyButton from '@root/components/buttons/ReplyButton';
import GPT from '@root/components/GPT/gpt';
import { useAccount } from 'wagmi'

const q = faunadb.query;
const client = new faunadb.Client({ domain:"db.us.fauna.com", secret:process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, keepAlive: true });

const TopicPage = () => {
  const router = useRouter();
  const { slug, category } = router.query; // Get the category from the URL

  // Adjust the query to use the category
  const GET_TOPIC_BY_SLUG = gql`
    query MyTopicQuery($slug: String!){
      ${category}_by_slug(slug: $slug) {
        _id
        slug
        topic
        content
        user
        eth_address
      }
    }
  `;

  // Fetch the topic data based on the slug using Apollo Client
  const { data, loading, error } = useQuery(GET_TOPIC_BY_SLUG, {
    variables: { slug },
    skip: !slug, 
    // Skip the query if the slug is not available
  }); 

  // const { user } = useUser();
  const { address, isConnected } = useAccount()

  const [showEdit, setShowEdit] = useState(false);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  // Render the topic data
  const topicData = data?.[`${category}_by_slug`];

  if (!topicData) {
    return <h1>404: Not Found</h1>
  }

  const handleEditToggle = () => {
    setShowEdit(prevState => !prevState);
  };

  const isAuthor = address === topicData.eth_address // check if current user is the author

    return (
    <div>
      <Header/>
      <div className={styles.topicHeading}>{topicData.topic}</div>
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          
          <table className={styles.topicTable}>
            <tbody>
              <tr>
                <td className={styles.leftColumn}>
                  <div>{topicData.eth_address}</div>
                  <div><span>Posts:</span> 0</div>
                  <div><span>Joined:</span> N/A</div>
                </td>
                <td className={styles.rightColumn}>
                  <div className={styles.titleBlock}>
                    <div className={styles.title}>{topicData.topic}</div>
                    <p className={styles.date}>19 February 2023, 22:09</p>
                  </div>
                  <div className={styles.content}>{parse(topicData.content)}</div>
                  {isAuthor && 
                    <button className={styles.editButton} onClick={handleEditToggle}>{showEdit ? "Hide Form" : "Edit Post"}</button>}
                    <CSSTransition
                      in={showEdit}
                      timeout={300}
                      classNames="slide"
                      unmountOnExit
                    >
                      <div>
                        {isAuthor && showEdit &&
                          <UpdateTopic category={category} setShowEdit={setShowEdit} />}
                      </div>
                    </CSSTransition>
                </td>
              </tr>
            </tbody>
          </table>
          <ReplyButton category={category} /> 
          <GPT />
          <CommentList category={category} /> 
        </div>
      </div>
    </div>
  );
};

export default TopicPage;
