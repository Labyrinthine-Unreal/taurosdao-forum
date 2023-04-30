// src/components/CreateTopic.js
import React, { useState } from 'react';
import faunadb from 'faunadb';
const q = faunadb.query;
const CreateTopic = ({ onCreate }) => {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const client = new faunadb.Client({ secret:process.env.FAUNADB_SECRET, keepAlive: false });
  console.log(client)
  // const id = client.query(q.CurrentIdentity());

  // var createP = client.query(
  //   q.Create(
  //     q.Collection('topics'),
  //     { data: { user: userId, name:user.firstName  } }
  //   )
  // )

  const handleSubmit = (e) => {
    e.preventDefault();
      var createP = client.query(
    q.Create(
      q.Collection('topics'),
      { data: { topic: topic, content:content } }
    ))
    createP.then(function(response) {
      console.log(response.ref); // Logs the ref to the console.
    })
  };


  return (
    <div>
      <h2>Create a New Topic</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="topic">Topic:</label>
        <input
          type="text"
          id="topic"
          name="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <br />
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateTopic;
