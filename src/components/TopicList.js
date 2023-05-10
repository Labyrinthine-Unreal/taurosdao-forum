// src/components/TopicList.js
import React from "react";
import Link from 'next/link';
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import parse from 'html-react-parser';
import styles from './TopicList.module.css';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'

const ITEMS_QUERY = gql`
query MyTopicQuery {
  topics_by_id{
    data {
      _id
      topic 
      content
      user
      slug
    }
  }
 }
`;
console.log(ITEMS_QUERY)

export default function TopicList() {
 const { data, loading, error } = useQuery(ITEMS_QUERY);
 console.log(data)
 const { user } = useUser()
 
 if (loading) return 'Loading...';
 if (error) return `Error! ${error.message}`;


  return (
      <>
        <div>
          {data.topics_by_id.data.map((item) => {
              return (
                <Link href={`/topics/${item.slug}`} key={item.id}>
                  <div key={item.id} className={styles.topicItem}>
                    <div className={styles.topicTitle}>{item.topic}:{item.user}</div> 
                    <div className={styles.topicContent}>{parse(item.content)}:{item._id}</div>
                  </div>
                </Link>
              );
          })}
        </div>
      </> 
  );
  }