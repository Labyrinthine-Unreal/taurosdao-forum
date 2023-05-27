// src/components/topicComponents/TopicList.js
import React from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faPencil } from '@fortawesome/free-solid-svg-icons'
import styles from './TopicList.module.css';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'

export default function TopicList({ topics, switchView }) {
  const router = useRouter();
  const { user } = useUser()
  
  const handleNewTopic = () => {
    router.push('/categories/create-new-topic');
  };

  return (
    <>
      <div className={styles.container}>
        <button onClick={switchView}>Switch to Bubble View</button>
        <button onClick={handleNewTopic} className={styles.newTopicButton}>
          <FontAwesomeIcon icon={faPencil} style={{ marginRight: "20px" }} />New Topic
        </button>
        <table className={styles.topicTable}>
          <thead>
            <tr>
              <th colSpan="5" className={styles.tableHeader}>Topics</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((item) => {
              return (
                <tr key={item.id} className={styles.topicRow}>
                  <td className={styles.topicColumn}>
                    <FontAwesomeIcon icon={faFile} />
                  </td>
                  <td>
                    <Link href={`/topics/${item.slug}`}>
                      <span className={styles.topicLink}>
                        <div className={styles.topicTitle}>{item.topic}</div>
                        <div className={styles.topicAuthor}>Posted by {item.user} at time</div>
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
        <button onClick={handleNewTopic} className={styles.newTopicButton}>
          <FontAwesomeIcon icon={faPencil} style={{ marginRight: "20px" }} />New Topic
        </button>
      </div>
    </>
  );
}
