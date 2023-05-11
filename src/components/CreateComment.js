// src/components/UpdateTopic.js
import React, { useState } from 'react';
import faunadb from 'faunadb';
import { EditorState, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import FlippingButton from './FlippingButton';
import dynamic from 'next/dynamic';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
import slugify from 'slugify';
import shortid from 'shortid';
import { useRouter } from 'next/router';
import styles from './CreateTopic.module.css'
import { useQuery, gql } from '@apollo/client';
const Editor = dynamic(
    () => import('react-draft-wysiwyg').then((module) => module.Editor),
    { ssr: false }
);

const q = faunadb.query;
const CreateComment = ({ onPostCreated }) => {

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

    const [topic, setTopic] = useState('');
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );

    const router = useRouter();
    const { slug } = router.query;
    const { user } = useUser()

    const client = new faunadb.Client({ secret: "fnAFDZGm3pAASZlfCHemrt0fvXUPK1gb0ZqnbR6f", keepAlive: true });
    console.log(client)

    const { data, loading, error } = useQuery(GET_TOPIC_BY_SLUG, {
        variables: { slug },
        skip: !slug, 
        // Skip the query if the slug is not available
      }) 

      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error.message}</div>;

      const topicData = data?.topics_by_slug.slug;
      console.log(data)
      console.log(data?.topics_by_slug.slug)

      if (!topicData) {
        return <h1>404: Not Found</h1>
      }
    
    //   const isAuthor = user.username === data?.topics_by_slug.user // check if current user is the author
      console.log(user.username)
      console.log(data?.topics_by_slug._id)

    const handleSubmit = (e) => {
        e.preventDefault();
        const contentState = editorState.getCurrentContent();
        const comment = stateToHTML(contentState);

        const generatedSlug = slugify(topic, { lower: true, strict: true }) + '-' + shortid.generate();

        var createP = client.query(q.Create(q.Collection('comments'), comment),
                { data: {
                    date: new Date().toString(),
                    comment: comment, user: user.username, slug: generatedSlug } }
            )
            console.log(JSON.stringify(createP, null, 2))
        

        createP.then(function (response) {
            console.log(response.ref.id); // Logs the ref to the console.
            // onPostCreated(response.data); // Call the callback with the new post data
            // router.push(`/topics/${response.data.slug}`); // Redirect the user to the new topic's page
        })
    };


    return (
        <>
            <div className={styles.container}>
                <h2>Add Comment</h2>
                <form onSubmit={handleSubmit} className={styles.topicInput}>
                    {/* <input
                        type="text"
                        id="topic"
                        name="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                    <br /> */}
                    <label htmlFor="content">Comment</label>
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
        </>
    );
};

export default CreateComment;
