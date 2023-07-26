// src/pages/categories/create-topic.js
import CreateTopic from '@root/components/topicComponents/Forum/CreateTopic';
import faunadb from 'faunadb';
import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import withCategoryStyles from '@root/components/cards/withCategoryStyles';
import parse from 'html-react-parser';
import Header from '@root/components/layout/Header';

const CreateNewTopic = () => {
  const secret = Clerk.session.getToken({ template: 'fauna' });
  console.log(secret);
  const client = new faunadb.Client({ domain:"db.us.fauna.com", secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, keepAlive: true });
  console.log(client);
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();
  const [newPost, setNewPost] = useState(null);

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
        <CreateTopic onPostCreated={handlePostCreated} />
      )}
    </div>
    </>
  );
};

export default withCategoryStyles(CreateNewTopic);
