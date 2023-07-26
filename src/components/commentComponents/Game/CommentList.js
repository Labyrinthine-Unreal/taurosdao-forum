// src/components/commentComponents/Game/CommentList.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import { useUser } from '@clerk/nextjs';
import parse from 'html-react-parser';
import Header from '@root/components/layout/Header';
import UpdateTopic from '@root/components/topicComponents/Game/UpdateTopic';
import faunadb from 'faunadb';
import { CSSTransition } from 'react-transition-group';
import ReplyButton from '@root/components/buttons/gameReplyButton';
import styles from '../CommentList.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faPencil } from '@fortawesome/free-solid-svg-icons'

const q = faunadb.query;
const client = new faunadb.Client({ domain:"db.us.fauna.com", secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, keepAlive: true });

const GET_TOPIC_BY_SLUG = gql`
query MyTopicQuery($slug: String!){
  game_by_slug(slug: $slug) {
    _id
    slug
    topic
    content
    user
    # comment
    }
  }
`;

const CommentList = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data, loading, error } = useQuery(GET_TOPIC_BY_SLUG, {
    variables: { slug },
    skip: !slug,
  })
  const { user } = useUser()
  const [comments, setComments] = useState([]); // <-- store comments in state

  useEffect(() => {
    if (data?.game_by_slug.slug) {
      var createP = client.query(
        q.Paginate(q.Match(q.Index("getgameCommentsBySlug"), data?.game_by_slug.slug))
      );
      createP.then(async function (response) {
        // Check if response.data is defined and is an array
        if (Array.isArray(response.data)) {
          response.data.map(
            ([item, ref, comment, name, slug, date]) => {
              console.log(comment)
              console.log(name)
              console.log(response.data)
              console.log(JSON.stringify(response.data))
              // Check if response.data[0] is defined and is an array with at least 5 elements
              if (Array.isArray(response.data[0]) && response.data[0].length >= 5) {
              }
              // Check if response.data[1] is defined and is an array with at least 5 elements
              if (Array.isArray(response.data[1]) && response.data[1].length >= 5) {
              }
            }
          )
          setComments(response.data); // <-- update comments state
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
            {comments.map(([item, slug, name,comment, date, ref], index) => {
                return (
                  <tr key={index} className={styles.commentRow}>
                    <td className={styles.commentColumn}>
                      <FontAwesomeIcon icon={faFile} />
                    </td>
                    <td>
                      <div className={styles.commentAuthor}>Posted by {name} at {date}</div>
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