import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import styles from '@root/styles/Home.module.css'
import { useState } from 'react';

export default function Home() {
  const handleRegistration = (e) => {
    e.preventDefault();
    alert("Registration complete. (Data not saved)");
  };



  return (
    <div className={styles.container}>
      <Head>
        <title>Simple Forum</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Simple Forum</h1>
      <ul>
      <li>
          <Link href="/categories/general">
            <span className={styles.categoryLink}>General</span>
          </Link>
        </li>
        <li>
          <Link href="/categories/code">
            <span className={styles.categoryLink}>Code</span>
          </Link>
        </li>
        <li>
          <Link href="/categories/design">
            <span className={styles.categoryLink}>Design</span>
          </Link>
        </li>
        <li>
          <Link href="/categories/marketing">
            <span className={styles.categoryLink}>Marketing</span>
          </Link>
        </li>
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
    </div>
  );
}
