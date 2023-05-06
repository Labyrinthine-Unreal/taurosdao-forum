// src/pages/categories/create-topic.js
import CreateTopic from '@root/components/CreateTopic';
import faunadb from 'faunadb';
import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import withCategoryStyles from '@root/components/withCategoryStyles';
import parse from 'html-react-parser';

const CreateNewTopic = () => {
  const secret = Clerk.session.getToken({ template: 'fauna' });
  console.log(secret);
  const client = new faunadb.Client({ secret: "fnAFClf-6BAATcIrDU1kFAR-2IpS1I3oRwlLYVAd", keepAlive: false });
  console.log(client);
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();
  const [newPost, setNewPost] = useState(null);

  const handlePostCreated = (post) => {
    setNewPost(post);
  };

  return (
    <div>
      Hello, {user.fullName}
      {newPost ? (
        <div>
          <h3>New Post:</h3>
          <div>{newPost.topic}</div>
          <div>{parse(newPost.content)}</div>
        </div>
      ) : (
        <CreateTopic onPostCreated={handlePostCreated} />
      )}
    </div>
  );
};

export default withCategoryStyles(CreateNewTopic);
