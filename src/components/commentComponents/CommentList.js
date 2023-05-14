// src/components/commentComponents/CommentList.js
import React from "react";
import Link from 'next/link';
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from 'next/router';
import parse from 'html-react-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faPencil } from '@fortawesome/free-solid-svg-icons'
import styles from '@root/components/topicComponents/TopicList.module.css';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
import faunadb from 'faunadb';

const q = faunadb.query;

const ITEMS_QUERY = gql`
query MyCommentQuery {
  comments_by_id{
    data{
      _id
        date
      forumID
      comment
      user
      slug
    }
    }
  }
 
`;


// console.log(ITEMS_QUERY)

export default function CommentList() {
  const router = useRouter();
  const { data, loading, error } = useQuery(ITEMS_QUERY);
  console.log(data)
  const { user } = useUser()
  
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const client = new faunadb.Client({ secret: "fnAFDZGm3pAASZlfCHemrt0fvXUPK1gb0ZqnbR6f", keepAlive: true });
  // console.log(client)

  const results = client.query(
    q.Paginate(q.Match(q.Index("comments_by_id"), data.comments_by_id.slug)))
  console.log(results)

  // const isAuthor = user.username === data?.topics_by_slug.user // check if current user is the author
  // console.log(data?.comments_by_id.forumID)

  const isPostID = data?.comments_by_id.forumID === data?.comments_by_id.slug
  // console.log(isPostID)


  return (
      <>
        <div className={styles.container}>
                    
          <table className={styles.topicTable}>
            <thead>
              <tr>
                <th colSpan="5" className={styles.tableHeader}>Comments</th>
              </tr>
            </thead>
            <tbody>
              {data.comments_by_id.data.map((item) => {
                return (
                  <tr key={item.slug} className={styles.topicRow}>
                    <td className={styles.topicColumn}>
                      <FontAwesomeIcon icon={faFile} />
                    </td>
                    <td>
                        <span className={styles.topicLink}>
                        {item.forumID}
                          <div className={styles.topicTitle}>{item.comment}</div>
                          <div className={styles.topicAuthor}>Posted by {item.user} at {item.date}</div>
                        </span>
                    </td>
                  
                  </tr>
                );
              })}
            </tbody>
          </table>
          
        
        </div>
      </> 
  );
  }
  
  
