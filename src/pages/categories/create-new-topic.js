// src/pages/categories/create-topic.js
import CreateTopic from '@root/components/CreateTopic';
import faunadb from 'faunadb';
import React from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import withCategoryStyles from '@root/components/withCategoryStyles';

const CreateNewTopic = () => {
  const secret = Clerk.session.getToken({ template: 'fauna' });
  console.log(secret);
  const client = new faunadb.Client({ secret: "fnAFClf-6BAATcIrDU1kFAR-2IpS1I3oRwlLYVAd", keepAlive: false });
  console.log(client);
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();

  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <div>
      Hello, {user.fullName}
      <h1>Create a New Topic</h1>
      <CreateTopic />
    </div>
  );
};

export default withCategoryStyles(CreateNewTopic);
