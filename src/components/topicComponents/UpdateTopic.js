// src/components/topicComponents/AI/UpdateTopic.js
import React, { useState } from 'react';
import faunadb from 'faunadb';
import { EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import FlippingButton from '../buttons/FlippingButton';
import dynamic from 'next/dynamic';
import { useUser } from '@clerk/nextjs'
import slugify from 'slugify';
import shortid from 'shortid';
import { useRouter } from 'next/router';
import styles from './CreateTopic.module.css'
import { useQuery, gql } from '@apollo/client';
import { useAccount } from 'wagmi'

const Editor = dynamic(
    () => import('react-draft-wysiwyg').then((module) => module.Editor),
    { ssr: false }
);

const q = faunadb.query;

// At the moment this is called from [slug] in each category
const UpdateTopic = ({ category }) => {

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

    const [topic, setTopic] = useState('');
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );

    const router = useRouter();
    const { slug } = router.query;
    const { user } = useUser()
    const { address, isConnected } = useAccount()
    
    const client = new faunadb.Client({ domain:"db.us.fauna.com", secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, keepAlive: true });
    console.log(client)

    const { data, loading, error } = useQuery(GET_TOPIC_BY_SLUG, {
        variables: { slug },
        skip: !slug, 
        // Skip the query if the slug is not available
      }) 

      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error.message}</div>;

      const topicData = data[`${category}_by_slug`].slug;
      console.log(data)
      console.log(data[`${category}_by_slug`].slug)

      if (!topicData) {
        return <h1>404: Not Found</h1>
      }
    
    //   const isAuthor = user.username === data[`${category}_by_slug`].user // check if current user is the author
      console.log(user.username)
      console.log(data[`${category}_by_slug`]._id)

    const handleSubmit = (e) => {
        e.preventDefault();
        const contentState = editorState.getCurrentContent();
        const content = stateToHTML(contentState);

        const generatedSlug = slugify(topic, { lower: true, strict: true }) + '-' + shortid.generate();

        var createP = client.query(
            q.Update(
                q.Ref(q.Collection(category), data[`${category}_by_slug`]._id),
                { data: { topic: topic, content: content, user: user.username, slug: generatedSlug,eth_address:address } }
            )
        )

        createP.then(function (response) {
            console.log(response.ref); // Logs the ref to the console.
            // onPostCreated(response.data); // Call the callback with the new post data
            router.push(`/${category}/${response.data.slug}`); // Redirect the user to the new topic's page
        })
    };


    return (
        <>
            <div className={styles.container}>
                <h2>Edit Post</h2>
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

export default UpdateTopic;
