// src/components/commentComponents/CommentList.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import { useUser } from '@clerk/nextjs';
import parse from 'html-react-parser';
import Header from '@root/components/layout/Header';
import UpdateTopic from '@root/components/topicComponents/UpdateTopic';
import faunadb from 'faunadb';
import { CSSTransition } from 'react-transition-group';
import ReplyButton from '@root/components/buttons/ReplyButton';

const q = faunadb.query;
const client = new faunadb.Client({ secret: "fnAFDZGm3pAASZlfCHemrt0fvXUPK1gb0ZqnbR6f", keepAlive: true });

const GET_TOPIC_BY_SLUG = gql`
query MyTopicQuery($slug: String!){
  topics_by_slug(slug: $slug) {
    _id
    slug
    topic
    content
    user
    comment
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
    if (data?.topics_by_slug.slug) {
      var createP = client.query(
        q.Paginate(q.Match(q.Index("getCommentsBySlug"), data?.topics_by_slug.slug))
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
                console.log(response.data[0][3])
                console.log(response.data[0][4])
              }
              // Check if response.data[1] is defined and is an array with at least 5 elements
              if (Array.isArray(response.data[1]) && response.data[1].length >= 5) {
                console.log(response.data[1][3])
                console.log(response.data[1][4])
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
      Comments
      <br />
      {comments.map(([item, ref, comment, name, slug, date], index) => (
  <div key={index}>
    <p>{comment}</p>
    <p>{name}</p>
  </div>
))}
    </>
  )
}

export default CommentList;
