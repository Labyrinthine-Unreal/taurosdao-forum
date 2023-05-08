// src/components/CreateTopic.js
import React, { useState } from 'react';
import faunadb from 'faunadb';
import { EditorState, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import FlippingButton from './FlippingButton';
import styles from './CreateTopic.module.css';
import dynamic from 'next/dynamic';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
import slugify from 'slugify';
import shortid from 'shortid';
import { useRouter } from 'next/router';

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
  
  const client = new faunadb.Client({ secret:"fnAFDZGm3pAASZlfCHemrt0fvXUPK1gb0ZqnbR6f", keepAlive: false });
  console.log(client)
  

  const { user } = useUser()

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const contentState = editorState.getCurrentContent();
    const content = stateToHTML(contentState);

    const generatedSlug = slugify(topic, { lower: true, strict: true }) + '-' + shortid.generate();

    var createP = client.query(
      q.Create(
        q.Collection('topics'),
        { data: { topic: topic, content:content,user:user.username, slug: generatedSlug } }
      ))
    createP.then(function(response) {
      console.log(response.ref); // Logs the ref to the console.
      onPostCreated(response.data); // Call the callback with the new post data
      router.push(`/topics/${response.data.slug}`); // Redirect the user to the new topic's page
    })
  };

  
  return (
    <div>
      <h2>Create a New Topic</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="topic"
          name="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className={styles.topicInput}
        />
        <br />
        <label htmlFor="content">Content:</label>
        <Editor
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
  );
};

export default CreateTopic;
