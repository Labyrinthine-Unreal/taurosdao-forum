// src/pages/categories/general.js
import TopicList from '@root/components/topicComponents/Art/TopicList';
import faunadb from 'faunadb';
import React from 'react';
import Header from '@root/components/layout/Header';
import { useAuth } from '@clerk/nextjs';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
import withCategoryStyles from '@root/components/cards/withCategoryStyles';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

const Art = () => {
  // const secret = Clerk.session.getToken({ template: 'fauna' })
  // console.log(secret)
  // const client = new faunadb.Client({ domain:"db.us.fauna.com", secret:process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, keepAlive: true });
  // console.log(client)
  // const { isLoaded, userId, sessionId, getToken } = useAuth();
  // const { user } = useUser()

  // if (!isLoaded || !userId) {
  //   return null;
  // }
  
  return (
    
    <div>
      <Header/>
      <h1>Art Topics</h1>
      <TopicList/>
    </div>
  );
};

export default withCategoryStyles(Art);
