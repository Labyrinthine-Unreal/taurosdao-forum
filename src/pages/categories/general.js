// src/pages/categories/general.js
import TopicList from '@root/components/TopicList';
import faunadb from 'faunadb';
import React from 'react';
import Header from '@root/components/Header';
import { useAuth } from '@clerk/nextjs';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
import withCategoryStyles from '@root/components/withCategoryStyles';
import { useRouter } from 'next/router';
import styles from '@root/styles/Categories.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

const General = () => {
  const secret = Clerk.session.getToken({ template: 'fauna' })
  console.log(secret)
  const client = new faunadb.Client({ secret:"fnAFDZGm3pAASZlfCHemrt0fvXUPK1gb0ZqnbR6f", keepAlive: true });
  console.log(client)
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user } = useUser()
  const router = useRouter();

  if (!isLoaded || !userId) {
    return null;
  }

  const handleNewTopic = () => {
    router.push('/categories/create-new-topic');
  };
  
  return (
    
    <div>
      <Header/>
      Hello, {user.fullName}
      <h1>General Topics</h1>
      <button onClick={handleNewTopic} className={styles.newTopicButton}><FontAwesomeIcon icon={faPencil} style={{ marginRight: "20px" }} />New Topic</button>
      <TopicList/>
    </div>
  );
};

export default withCategoryStyles(General);
