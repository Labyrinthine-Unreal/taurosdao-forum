// src/components/TopicList.js
import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import parse from 'html-react-parser';
import styles from './TopicList.module.css';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'

const ITEMS_QUERY = gql`
query MyTopicQuery {
  topics_by_slug {
    data {
      _id
      topic 
      content
    }
  }
 }
`;

// mutation topicCreation {
//   createTopics(data: { user: "test",topic:"test",content:"content" }) {
//     _id
//    user
//    topic
//    content
//   }
//  }
 
//  query TopicQuery {
//    topics_by_slug{
//      data {
//        _id
//        user
//        topic 
//        content
//      }
//    }

console.log(ITEMS_QUERY)

export default function TopicList() {
 const { data, loading, error } = useQuery(ITEMS_QUERY);
 console.log(data)
 const { user } = useUser()
 
 if (loading) return 'Loading...';
 if (error) return `Error! ${error.message}`;


  return (
      <>
        <div style={{ padding: '10px' }}>
          {data.topics_by_slug.data.map((item) => {
              return (
                <div key={item.id} className={styles.topicItem}>
                <div className={styles.topicTitle}>{item.topic}:{user.username}</div> 
                <div className={styles.topicContent}>{parse(item.content)}</div>
                </div>
              );
          })}
        </div>
      </> 
  );
  }