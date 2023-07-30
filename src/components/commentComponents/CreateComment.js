// src/components/commentComponents/Art/CreateComment.js
import React, { useState } from 'react';
import faunadb from 'faunadb';
import { EditorState, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import FlippingButton from '@root/components/buttons/FlippingButton';
import dynamic from 'next/dynamic';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
import slugify from 'slugify';
import shortid from 'shortid';
import { useRouter } from 'next/router';
import styles from '@root/components/topicComponents/CreateTopic.module.css'
import { useQuery, gql } from '@apollo/client';
import { useAccount, useEnsAvatar, useDisconnect, useConnect } from 'wagmi'

const Editor = dynamic(
    () => import('react-draft-wysiwyg').then((module) => module.Editor),
    { ssr: false }
);

const q = faunadb.query;

// At the moment this is called from the button for each category
const CreateComment = ({ category, onPostCreated }) => {
    const GET_TOPIC_BY_SLUG = gql`
    query MyTopicQuery($slug: String!){
      ${category}_by_slug(slug: $slug) {
        _id
        slug
        topic
        content
        user
        eth_address
        }
      }
    `;
    const { address, isConnected } = useAccount()
    const [topic, setTopic] = useState('');
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );

    const router = useRouter();
    const { slug } = router.query;
    // const { user } = useUser()

    const client = new faunadb.Client({ domain:"db.us.fauna.com", secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, keepAlive: true });

    const { data, loading, error } = useQuery(GET_TOPIC_BY_SLUG, {
        variables: { slug },
        skip: !slug, 
        // Skip the query if the slug is not available
      }) 

      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error.message}</div>;

      const topicData = data?.[`${category}_by_slug`]?.slug;

      if (!topicData) {
        return <h1>404: Not Found</h1>
      }

    const handleSubmit = (e) => {
        e.preventDefault();
        const contentState = editorState.getCurrentContent();
        const comment = stateToHTML(contentState, {
          blockRenderers: {
            unstyled: (block) => block.getText()
          }
        });

        const generatedSlug = slugify(topic, { lower: true, strict: true }) + '-' + shortid.generate();

        var createP = client.query(
            q.Create(
              q.Collection(`${category}Comments`),
              { data: { 
                forumID:data?.[`${category}_by_slug`]._id, 
                date: new Date().toString(), 
                comment: comment,
                // name: user.username,
                slug: slug,
                eth_address:address
            } }
            ))
        

        createP.then(function (response) {
            router.push(`/${category}/${response.data.slug}`); // Redirect the user to the new topic's page
        })

    };


    return (
        <>
            <div className={styles.container}>
                <h2>Add Comment</h2>
                <form onSubmit={handleSubmit} className={styles.topicInput}>
             
                    <br />
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
