// src/components/topicComponents/create-new-topic.js
import CreateTopic from '@root/components/topicComponents/CreateTopic';
import faunadb from 'faunadb';
import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import withCategoryStyles from '@root/components/cards/withCategoryStyles';
import parse from 'html-react-parser';
import Header from '@root/components/layout/Header';
import { useRouter } from 'next/router';

const CreateNewTopic = () => {
  // const secret = Clerk.session.getToken({ template: 'fauna' });
  // console.log(secret);
  const client = new faunadb.Client({ domain:"db.us.fauna.com", secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, keepAlive: true });
  console.log(client);
  // const { isLoaded, userId, sessionId, getToken } = useAuth();
  // const { user } = useUser();
  const [newPost, setNewPost] = useState(null);

  // Use the useRouter hook from Next.js
  const router = useRouter();
  // Extract the category from the path. This assumes the path is of the form /[category]/create-new-topic
  const category = router.asPath.split('/')[1];
  console.log(router.asPath.split('/')[1])

  const handlePostCreated = (post) => {
    setNewPost(post);
  };

  return (
    <>
    <Header/>
    <div>
      {newPost ? (
        <div>
          <div>{newPost.topic}</div>
          <div>{parse(newPost.content)}</div>
        </div>
      ) : (
        <CreateTopic category={category} onPostCreated={handlePostCreated} />
      )}
    </div>
    </>
  );
};

export default withCategoryStyles(CreateNewTopic);
