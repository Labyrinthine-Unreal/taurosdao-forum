import React from "react";
import { useRouter } from 'next/router'
import styles from './Bubble.module.css';

const Bubble = ({ slug, topic, content }) => {
  const router = useRouter();

  return (
    <div
      className={styles.bubble}
      onClick={() => router.push(`/topics/${slug}`)}
    >
      <h2>{topic}</h2>
      <p>{content}</p>
    </div>
  );
};

export default Bubble;
