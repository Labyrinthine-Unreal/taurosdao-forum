// src/components/topicComponents/TopicList.js
import React from "react";
import Link from 'next/link';
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faPencil } from '@fortawesome/free-solid-svg-icons'
import styles from './TopicList.module.css';
import { useUser } from '@clerk/nextjs'

import faunadb from 'faunadb';
const q = faunadb.query;

// At the moment this is called from index.js in each category
export default function TopicList({ category }) {
  const ITEMS_QUERY = gql`
  query MyTopicQuery {
    ${category}_by_id(_size:100){
      data {
        _id
        topic 
        content
        user
        slug
        eth_address
      }
      after
      before
    }
  }
  `;

  console.log(ITEMS_QUERY)

  const router = useRouter();
  const { data, loading, error } = useQuery(ITEMS_QUERY);
  console.log(data)
  const { user } = useUser()
  
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const client = new faunadb.Client({ domain:"db.us.fauna.com", secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, keepAlive: true });
  console.log(client)

  client.query(
    q.Reverse([data])
  )

 const handleNewTopic = () => {
  router.push(`/${category}/create-new-topic`);
};

  return (
      <>
        <div className={styles.container}>
          <button onClick={handleNewTopic} className={styles.newTopicButton}><FontAwesomeIcon icon={faPencil} style={{ marginRight: "20px" }} />New Topic</button>
          
          <table className={styles.topicTable}>
            <thead>
              <tr>
                <th colSpan="5" className={styles.tableHeader}>Topics</th>
              </tr>
            </thead>
            <tbody>
              {data[`${category}_by_id`]?.data.map((item) => {              
                return (
                  <tr key={item.id} className={styles.topicRow}>
                    <td className={styles.topicColumn}>
                      <FontAwesomeIcon icon={faFile} />
                    </td>
                    <td>
                      <Link href={`/${category}/${item.slug}`}>
                        <span className={styles.topicLink}>
                          <div className={styles.topicTitle}>
                            {item.topic}
                            </div>
                          <div className={styles.topicAuthor}>
                            Posted by {item.user} at time
                            </div>
                        </span>
                      </Link>
                    </td>
                    <td className={styles.viewsAndReplies}>
                      <div>0</div>
                      <div>Replies</div>
                    </td>
                    <td className={styles.viewsAndReplies}>
                      <div>0</div>
                      <div>Views</div>
                    </td>
                    <td className={styles.dateAndTime}>
                      <div>{item.user}</div>
                      <div>Date and time</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <button onClick={handleNewTopic} className={styles.newTopicButton}><FontAwesomeIcon icon={faPencil} style={{ marginRight: "20px" }} />New Topic</button>
        </div>
      </> 
    );
  }
