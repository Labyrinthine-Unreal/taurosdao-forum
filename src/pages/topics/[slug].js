// src/pages/topics/[slug].js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import { useUser } from '@clerk/nextjs';
import parse from 'html-react-parser';
import Header from '@root/components/Header';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from '@fortawesome/free-solid-svg-icons';
import styles from './TopicPage.module.css';
import Link from 'next/link';
import UpdateTopic from '@root/components/UpdateTopic';
import { ModalOverlay,Modal,Input,FormControl,ModalContent,ModalCloseButton,ModalHeader,ModalBody,FormLabel,ModalFooter,Button } from '@chakra-ui/react';
import faunadb from 'faunadb';
import CreateComment from '@root/components/CreateComment';
import CommentList from '@root/components/CommentList';
const client = new faunadb.Client({ secret:"fnAFDZGm3pAASZlfCHemrt0fvXUPK1gb0ZqnbR6f", keepAlive: true });
console.log(client)
import { CSSTransition } from 'react-transition-group';


const GET_TOPIC_BY_SLUG = gql`
query MyTopicQuery($slug: String!){
  topics_by_slug(slug: $slug) {
    _id
    slug
    topic
    content
    user
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
  console.log(data)
  console.log(data?.topics_by_slug.slug)

  // if (!data?.topics_by_slug) {
  //   return <h1>404: Not Found</h1>
  // }

  if (!topicData) {
    return <h1>404: Not Found</h1>
  }

  const handleToggle = () => {
    setShowEdit(prevState => !prevState);
  };

  const isAuthor = user.username === data?.topics_by_slug.user // check if current user is the author
  console.log(user.username)
  console.log(data?.topics_by_slug.user)

    return (
    <div>
      <Header/>
      <div className={styles.topicHeading}>{data?.topics_by_slug.topic}</div>
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <button className={styles.replyButton}><FontAwesomeIcon icon={faReply} style={{ marginRight: "20px" }} />Post Reply</button>
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
                    <button className={styles.editButton} onClick={handleToggle}>{showEdit ? "Hide Form" : "Edit Post"}</button>}
                    <CSSTransition
                      in={showEdit}
                      timeout={300}
                      classNames="slide"
                      unmountOnExit
                    >
                      <div>
                        {isAuthor && showEdit &&
                          <UpdateTopic setShowEdit={setShowEdit} />}
                          <CreateComment />
                          <CommentList />
                        </div>
                    </CSSTransition>
                </td>
              </tr>
            </tbody>
          </table>
          <button className={styles.replyButton}><FontAwesomeIcon icon={faReply} style={{ marginRight: "20px" }} />Post Reply</button>
        </div>
      </div>
    </div>
  );
};

export default TopicPage;

