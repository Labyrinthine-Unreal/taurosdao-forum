import Head from 'next/head'
import Image from 'next/image'
import styles from '@root/styles/Home.module.css'
import { useState } from 'react';

export default function Home() {
  const [topics, setTopics] = useState([]);

  const handleRegistration = (e) => {
    e.preventDefault();
    alert("Registration complete. (Data not saved)");
  };

  const handleNewTopic = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const content = e.target.content.value;

    setTopics([...topics, { title, content }]);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Simple Forum</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Simple Forum</h1>
      <ul>
        <li>General</li>
        <li>Code</li>
        <li>Design</li>
        <li>Marketing</li>
      </ul>

      <h2>Registration</h2>
      <form onSubmit={handleRegistration}>
        <label htmlFor="nickname">Nickname:</label>
        <input type="text" id="nickname" name="nickname" required />
        <br />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
        <br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />
        <br />
        <input type="submit" value="Register" />
      </form>

      <h2>Create Topic</h2>
      <form onSubmit={handleNewTopic}>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" required />
        <br />
        <label htmlFor="content">Content:</label>
        <textarea id="content" name="content" required />
        <br />
        <input type="submit" value="Create Topic" />
      </form>

      <h2>Topics</h2>
      {topics.map((topic, index) => (
        <div key={index}>
          <h3>{topic.title}</h3>
          <p>{topic.content}</p>
        </div>
      ))}
    </div>
  );
}
