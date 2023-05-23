// src/components/commentComponents/CommentList.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import { useUser } from '@clerk/nextjs';
import parse from 'html-react-parser';
import Header from '@root/components/layout/Header';
// import styles from './TopicPage.module.css';
import UpdateTopic from '@root/components/topicComponents/UpdateTopic';
import faunadb from 'faunadb';
// import CommentList from '@root/components/commentComponents/CommentList';
import { CSSTransition } from 'react-transition-group';
import ReplyButton from '@root/components/buttons/ReplyButton';
const q = faunadb.query;
const client = new faunadb.Client({ secret:"fnAFDZGm3pAASZlfCHemrt0fvXUPK1gb0ZqnbR6f", keepAlive: true });

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


// console.log(ITEMS_QUERY)

const CommentList = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data, loading, error } = useQuery(GET_TOPIC_BY_SLUG, {
    variables: { slug },
    skip: !slug, 
    // Skip the query if the slug is not available
  }) 
  const { user } = useUser()
  
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const client = new faunadb.Client({ secret: "fnAFDZGm3pAASZlfCHemrt0fvXUPK1gb0ZqnbR6f", keepAlive: true });
  // console.log(client)

  var createP = client.query(
    q.Paginate(q.Match(q.Index("getCommentsBySlug"), data?.topics_by_slug.slug))
    
  );

  var results = createP.then(async function (response) {
    response.data.map(
      ([item,ref,comment,name,slug,date]) => {
        // item
        // ref
        console.log(comment)
        console.log(name)
        console.log(response.data)
        console.log(JSON.stringify(response.data))
        console.log(response.data[0][3])
        console.log(response.data[0][4])
        console.log(response.data[1][3])
        console.log(response.data[1][4])
      }
    )
})

  

  // const isPostID = data?.comments_by_id.forumID === data?.comments_by_id.slug
  // console.log(isPostID)


  return (
    
      <>
      
        <div>
                   {/* <>
                   {createP.then(async function (response) {
    response.data.map(
      ([item,ref,comment,name]) => {
        // item
        // ref
        console.log(comment)
        console.log(name)
        console.log(response.data)
        console.log(JSON.stringify(response.data))
        console.log(response.data[0][3])
        console.log(response.data[0][4])
        console.log(response.data[1][3])
        console.log(response.data[1][4])
      }
    )})}
    </>  */}
          <table>
            <thead>
              <tr>
                <th colSpan="5">Comments</th>
                {/* {createP.data} */}
              </tr>
            </thead>
            <tbody>
  
            </tbody>
          </table>
          
        
        </div>
        <>
        {/* {results} */}
              {/* <div> */}
              {/* {createP.then(function (response) {
              response.data.map((item) => {
                return (
                  <tr key={item.slug}>
                    <td >
                      <FontAwesomeIcon icon={faFile} />
                    </td>
                    <td>
                        <span >
                          {JSON.stringify(item.comment)}
                        </span>
                    </td>
                  
                  </tr>
                );
              })})} */}
              {/* </div> */}
             </>
      </> 
      
  );
  }
  
  
  export default CommentList;