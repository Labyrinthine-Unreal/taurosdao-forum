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
import styles from '../topicComponents/CreateTopic.module.css'
import { useAccount } from 'wagmi'
import GPT from '../GPT/gpt';
import { Center, Spacer } from '@chakra-ui/react';
const Editor = dynamic(
    () => import('react-draft-wysiwyg').then((module) => module.Editor),
    { ssr: false }
);

const q = faunadb.query;

const CreateUser = () => {
    const [username, setUser] = useState('');
    const [tagline, setTagline] = useState('');
    const [biography, setBiography] = useState('');

    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );

    const client = new faunadb.Client({
        domain: "db.us.fauna.com",
        secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY,
        keepAlive: true,
    });

    const { address, isConnected } = useAccount()

    String.prototype.format = function () {
        var i = 0, args = arguments;
        return this.replace(/{}/g, function () {
            return typeof args[i] != 'undefined' ? args[i++] : '';
        });
    }


    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        const contentState = editorState.getCurrentContent();
        const content = stateToHTML(contentState);

        // Create a slug from the username
        const slug = slugify(username, { lower: true });

        var createP = client.query(
            q.Create(
                q.Collection('users'),
                {
                    data: {
                        user: username,
                        eth_address: address,
                        // tagline: tagline,
                        biography: biography,
                        slug: slug, // Add the slug to the data
                    },
                }
            )
        );

        createP.then(function (response) {
            console.log(response.ref); // Logs the ref to the console.
            const artistSlug = response.data.slug; // Get the created slug
            router.push('/artists/[slug]', `/artists/${artistSlug}`); // Redirect the user to the artist's page
        });
    };

    if (isConnected)
    return (
        
        <div className={styles.container}>
            use TaurosGPT to help you build a valuable biography and to help us understand what inspires you <br />
            <Center><GPT /></Center>
            <br /> 
            <Spacer />
            <h2>Create Artist Biography</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUser(e.target.value)}
                />
                <input
                    type="text"
                    name="tagline"
                    placeholder="Tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                />
                <textarea
                    name="biography"
                    placeholder="Biography"
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                ></textarea>
                <button type="submit">Create Artist</button>
            </form>
        </div>
    );
};

export default CreateUser;
