import CreateTopic from '@root/components/CreateTopic';
import TopicList from '@root/components/TopicList';
import faunadb from 'faunadb';
import React from 'react';
import { useAuth } from '@clerk/nextjs';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
const General = () => {
  
  const secret = Clerk.session.getToken({ template: 'fauna' })
  console.log(secret)
  const client = new faunadb.Client({ secret:"fnAFClf-6BAATcIrDU1kFAR-2IpS1I3oRwlLYVAd", keepAlive: false });
  console.log(client)
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user } = useUser()

  if (!isLoaded || !userId) {
    return null;
  }
  
  return (
    
    <div>
      <SignedIn>
        {/* Mount the UserButton component */}
        <UserButton />
      </SignedIn>
      <SignedOut>
        {/* Signed out users get sign in button */}
        <SignInButton />
      </SignedOut>
      <h1>General Topics</h1>
      <CreateTopic />
        <TopicList/>
    </div>
  );
};

export default General;
