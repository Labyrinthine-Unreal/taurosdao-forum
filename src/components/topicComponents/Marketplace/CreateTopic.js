// src/components/topicComponents/Marketplace/CreateTopic.js
import React, { useState } from 'react';
import faunadb from 'faunadb';
import { EditorState, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import FlippingButton from '../../buttons/FlippingButton';
import dynamic from 'next/dynamic';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
import slugify from 'slugify';
import shortid from 'shortid';
import { useRouter } from 'next/router';
import styles from '../CreateTopic.module.css'
import { useAccount, useEnsAvatar, useDisconnect, useConnect } from 'wagmi'
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((module) => module.Editor),
  { ssr: false }
);

const q = faunadb.query;
const CreateTopic = ({ onPostCreated }) => {
  const [topic, setTopic] = useState('');
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  
  const client = new faunadb.Client({ domain:"db.us.fauna.com", secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, keepAlive: true });
  console.log(client)
  

  const { user } = useUser()
  const { address, isConnected } = useAccount()
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const contentState = editorState.getCurrentContent();
    const content = stateToHTML(contentState);

    const generatedSlug = slugify(topic, { lower: true, strict: true }) + '-' + shortid.generate();

    var createP = client.query(
      q.Create(
        q.Collection('marketplace'),
        { data: { topic: topic, content:content,user:user.username, slug: generatedSlug,eth_address:address } }
      ))
    createP.then(function(response) {
      console.log(response.ref); // Logs the ref to the console.
      onPostCreated(response.data); // Call the callback with the new post data
      router.push(`/topics/marketplace_slug/${response.data.slug}`); // Redirect the user to the new topic's page
    })
  };

  
  return (
    <>
    <div className={styles.container}>
      <h2>Create New Topic</h2>
      <form onSubmit={handleSubmit} className={styles.topicInput}>
        <input
          type="text"
          id="topic"
          name="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <br />
        <label htmlFor="content">Content:</label>
        <Editor
          toolbarOnFocus
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName={"editorClassName"}
          onEditorStateChange={setEditorState}
        />
        <br />
        <FlippingButton
          text="Submit"
          front="Done?"
          back="Submit"
          onClick={handleSubmit}
        />
      </form>
    </div>
    </>
  );
};

export default CreateTopic;
