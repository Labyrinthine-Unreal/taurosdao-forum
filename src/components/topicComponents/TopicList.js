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
import CreateUser from '../userSettings/create';
import DMSlide from '../messaging/slide';
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
  console.log(router)
  console.log(data)
  // const { user } = useUser()
  
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
      <CreateUser />
      <DMSlide />

      <div className={styles.container}>
        <button onClick={handleNewTopic} className={styles.newTopicButton}>
          <FontAwesomeIcon icon={faPencil} style={{ marginRight: "10px" }} />
          Create New Topic
        </button>

        <ul className={styles.topicList}>
          {data[`${category}_by_id`]?.data.map((item) => {
            return (
              <li key={item.id} className={styles.topicBox}>
                <FontAwesomeIcon icon={faFile} />
                <Link href={`/${category}/${item.slug}`}>
                  <span className={styles.topicLink}>
                    <div className={styles.topicContent}>
                      <div className={styles.topicTitle}>{item.topic}</div>
                      <div className={styles.topicAuthor}>
                        Posted by {item.eth_address} at time
                      </div>
                      <div className={styles.viewsAndReplies}>
                        <div>0</div>
                        <div>Replies</div>
                      </div>
                      <div className={styles.viewsAndReplies}>
                        <div>0</div>
                        <div>Views</div>
                      </div>
                      <div className={styles.dateAndTime}>
                        <div>{item.user}</div>
                        <div>Date and time</div>
                      </div>
                    </div>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <button onClick={handleNewTopic} className={styles.newTopicButton}>
          <FontAwesomeIcon icon={faPencil} style={{ marginRight: "10px" }} />
          Create New Topic
        </button>
      </div>
      </> 
    );
  }
