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

const Editor = dynamic(
    () => import('react-draft-wysiwyg').then((module) => module.Editor),
    { ssr: false }
);

const q = faunadb.query;

// This is called from create-new-topic in each category
const CreateUser = ({ onPostCreated }) => {
    const [username, setUser] = useState('');
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );

    const client = new faunadb.Client({ domain: "db.us.fauna.com", secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, keepAlive: true });
    console.log(client)

    // const { user } = useUser()
    const { address, isConnected } = useAccount()

    const router = useRouter();

    String.prototype.format = function () {
        var i = 0, args = arguments;
        return this.replace(/{}/g, function () {
            return typeof args[i] != 'undefined' ? args[i++] : '';
        });
    }



    // var createP = client.query(
    //     q.Create(
    //         q.Collection('dateJoined'),
    //         {
    //             data: {
    //                 // username: '@{}'.format(username),
    //                 eth_address: address,
    //                 date:new Date().toString()
    //             }
    //         } //user:user.username
    //     ))
    // createP.then(function (response) {
    //     console.log(response.ref); // Logs the ref to the console.
    //     //   onPostCreated(response.data); // Call the callback with the new post data
    //     router.push(`/`); // Redirect the user to the new topic's page
    // })


    const handleSubmit = (e) => {
        e.preventDefault();
        const contentState = editorState.getCurrentContent();
        const content = stateToHTML(contentState);

        // const generatedSlug = slugify(topic, { lower: true, strict: true }) + '-' + shortid.generate();

        var createP = client.query(
            q.Create(
                q.Collection('users'),
                {
                    data: {
                        username: '@{}'.format(username),
                        eth_address: address,
                        // date: new Date().toString(), 
                    }
                } //user:user.username
            ))
        createP.then(function (response) {
            console.log(response.ref); // Logs the ref to the console.
            //   onPostCreated(response.data); // Call the callback with the new post data
            router.push(`/`); // Redirect the user to the new topic's page
        })
    };


    return (
        <>
            <div className={styles.container}>
                <h2>Create Username</h2>
                <form onSubmit={handleSubmit} className={styles.topicInput}>
                    {/* <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUser(e.target.value)}
          /> */}
                    {/* <br />
          <br /> */}
                    <FlippingButton
                        text="Submit"
                        front="Done?"
                        back="Submit"
                        onClick={handleSubmit}
                    />
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUser(e.target.value)}
                    />
                </form>
            </div>

        </>
    );
};

export default CreateUser;
