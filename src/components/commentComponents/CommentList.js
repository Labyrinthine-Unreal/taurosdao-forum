// src/components/commentComponents/CommentList.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import { useUser } from '@clerk/nextjs';
import parse from 'html-react-parser';
import Header from '@root/components/layout/Header';
import faunadb from 'faunadb';
import { CSSTransition } from 'react-transition-group';
import styles from './CommentList.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faPencil } from '@fortawesome/free-solid-svg-icons'
import { useAccount } from 'wagmi'

const q = faunadb.query;
const client = new faunadb.Client({ domain:"db.us.fauna.com", secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, keepAlive: true });

// At the moment this is called from the [slug] in each category
const CommentList = ({ category }) => {
  const router = useRouter();
  const { slug } = router.query;
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
  const { data, loading, error } = useQuery(GET_TOPIC_BY_SLUG, {
    variables: { slug },
    skip: !slug,
  })
  // const { user } = useUser()
  const { address, isConnected } = useAccount()
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (data?.[`${category}_by_slug`]?.slug) {
      var createP = client.query(
        q.Paginate(q.Match(q.Index(`${category}CommentsBySlug`), data?.[`${category}_by_slug`]?.slug))
      );
      createP.then(async function (response) {
        if (Array.isArray(response.data)) {
          response.data.map(
            ([item, ref, comment, name, slug, date,eth_address]) => {
              console.log(comment)
              console.log(name)
              console.log(response.data)
              console.log(JSON.stringify(response.data))
            }
          )
          setComments(response.data);
        }
      })
    }
  }, [data]);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <>
        <div className={styles.container}>
          <table className={styles.commentTable}>
            <thead>
              <tr>
                <th colSpan="5" className={styles.tableHeader}>Comments</th>
              </tr>
            </thead>
            <tbody>
            {comments.map(([ref, slug, item,comment, date,eth_address], index) => {
                return (
                  <tr key={index} className={styles.commentRow}>
                    <td className={styles.commentColumn}>
                      <FontAwesomeIcon icon={faFile} />
                    </td>
                    <td>
                      <div className={styles.commentAuthor}>Posted by {eth_address} at {date}</div>
                      {comment}
                    </td>
                    <td className={styles.dateAndTime}>
                      <div>{date}</div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
    </>
  )
}

export default CommentList;
