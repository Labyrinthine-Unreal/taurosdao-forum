// src/pages/topics/[slug].js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import { useUser } from '@clerk/nextjs';
import parse from 'html-react-parser';
import Header from '@root/components/layout/Header';
import styles from './TopicPage.module.css';
import UpdateTopic from '@root/components/topicComponents/UpdateTopic';
import faunadb from 'faunadb';
import CommentList from '@root/components/commentComponents/CommentList';
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

const TopicPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  // Fetch the topic data based on the slug using Apollo Client
  const { data, loading, error } = useQuery(GET_TOPIC_BY_SLUG, {
    variables: { slug },
    skip: !slug, 
    // Skip the query if the slug is not available
  }) 

  const { user } = useUser();

  const [showEdit, setShowEdit] = useState(false);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  // Render the topic data
  const topicData = data?.topics_by_slug.slug;

  if (!topicData) {
    return <h1>404: Not Found</h1>
  }

  const handleEditToggle = () => {
    setShowEdit(prevState => !prevState);
  };


  var createP = client.query(
    q.Paginate(q.Match(q.Index("getCommentsBySlug"), data?.topics_by_slug.slug))
    
  );

  // console.log(createP)

  createP.then(function (response) {
    console.log(response.data.map(
      (item) => {
        console.log(item.value.id)
        console.log(item.value)
        // console.log(item.ref.comment)
        // console.log(item.ref.name)
        // item.comment
        // results.slug
        // JSON.parse(JSON.stringify(item));
      }
    )
    )

    // console.log(response.ref); // Logs the ref to the console. 
    // console.log(response.comment)
    // console.log(response)
    // response.data.map(
    //     ([ref,slug, date, name, comment]) => ({
    //       commentId: ref.id,
    //       slug,
    //       date,
    //       name,
    //       comment,
    //     }))

    // onPostCreated(response.data); // Call the callback with the new post data
    // router.push(`/topics/${response.data.slug}`); // Redirect the user to the new topic's page
}) 
// console.log(results)
// console.log(results.data.map(
//   (item) => {
//     item.comment
//   }
// ))
// console.log(results.ref.data)
  // return results.data.map(
  //   ([ref,slug, date, name, comment]) => ({
  //     commentId: ref.id,
  //     slug,
  //     date,
  //     name,
  //     comment,
  //   })
  // );


  const isAuthor = user.username === data?.topics_by_slug.user // check if current user is the author

    return (
    <div>
      <Header/>
      <div className={styles.topicHeading}>{data?.topics_by_slug.topic}</div>
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <ReplyButton />
          
          <table className={styles.topicTable}>
            <tbody>
              <tr>
                <td className={styles.leftColumn}>
                  <div>{topicData.user}</div>
                  <div><span>Posts:</span> 0</div>
                  <div><span>Joined:</span> N/A</div>
                </td>
                <td className={styles.rightColumn}>
                <div className={styles.titleBlock}>
                  <div className={styles.title}>{data?.topics_by_slug.topic}</div>
                    <p className={styles.date}>19 February 2023, 22:09</p>
                  </div>
                  <div className={styles.content}>{parse(data?.topics_by_slug.content)}</div>
                  
                  {isAuthor && 
                    <button className={styles.editButton} onClick={handleEditToggle}>{showEdit ? "Hide Form" : "Edit Post"}</button>}
                    <CSSTransition
                      in={showEdit}
                      timeout={300}
                      classNames="slide"
                      unmountOnExit
                    >
                      <div>
                        {isAuthor && showEdit &&
                          <UpdateTopic setShowEdit={setShowEdit} />}
                          
                        </div>
                    </CSSTransition>
                </td>
              </tr>
            </tbody>
          </table>
          <ReplyButton />
          
          {/* <CommentList /> */}
          {/* {results} */}
    {/* {results.data.map(
    ([ref,slug, date, name, comment]) => ({
      commentId: ref.id,
      slug,
      date,
      name,
      comment,
    })
  )}  */}
  
        </div>
      </div>
    </div>
  );
};

export default TopicPage;

