// src/components/TopicList.js
import React from "react";
import Link from 'next/link';
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from 'next/router';
import parse from 'html-react-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faPencil } from '@fortawesome/free-solid-svg-icons'
import styles from '../TopicList.module.css';
import { Stack, Center,Divider,Text } from "@chakra-ui/react";
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
import { Card, CardHeader, Flex,Avatar,Heading,IconButton,Button,BsThreeDotsVertical,BiLike,BiChat,BiShare,Box,Image,CardBody, CardFooter } from '@chakra-ui/react'

import faunadb from 'faunadb';
const q = faunadb.query;

const ITEMS_QUERY = gql`
query MyTopicQuery {
  topics_by_id(_size:100){
    data {
      _id
      topic 
      content
      user
      slug
    }
    after
    before
  }
 }
`;


console.log(ITEMS_QUERY)

export default function TopicList() {
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
  router.push('/categories/Forum/create-new-topic');
};

  return (
      <>

        <div className={styles.container}>
        {/* <Stack direction='row' h='100px' p={4}>
  <Divider orientation='vertical' />
  <Text>Chakra UI</Text>
</Stack> */}
          <button onClick={handleNewTopic} className={styles.newTopicButton}><FontAwesomeIcon icon={faPencil} style={{ marginRight: "20px" }} />New Topic</button>
          
          <table className={styles.topicTable}>
            <thead>
              <tr>

                <th colSpan="5" className={styles.tableHeader}>Topics</th>
              </tr>
            </thead>

            <tbody>
              {data.topics_by_id.data.map((item) => {
                                    
                return (
                  <tr key={item.id} className={styles.topicRow}>
                    <td className={styles.topicColumn}>
                      <FontAwesomeIcon icon={faFile} />
                    </td>
                    <td>
                      
                      <Link href={`/topics/forum_slug/${item.slug}`}>
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
  
  
  // <div>
  //         {data.topics_by_id.data.map((item) => {
  //             return (
  //               <Link href={`/topics/${item.slug}`} key={item.id}>
  //                 <div key={item.id} className={styles.topicItem}>
  //                   <div className={styles.topicTitle}>{item.topic}:{item.user}</div> 
  //                   <div className={styles.topicContent}>{parse(item.content)}:{item._id}</div>
  //                 </div>
  //               </Link>
  //             );
  //         })}
  //       </div>