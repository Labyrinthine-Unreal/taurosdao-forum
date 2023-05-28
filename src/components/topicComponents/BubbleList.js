// src/components/topicComponents/BubbleList.js
import Bubble from './Bubble';
import styles from './BubbleList.module.css';
import { useRouter } from 'next/router';

const BubbleList = ({topics, switchView}) => {
  const router = useRouter();

  const onPostClick = (slug) => {
    router.push(`/topics/${slug}`);
  };

  return (
    <div className={styles.bubbleContainer}>
      <button className={styles.switchButton} onClick={switchView}>Switch to List View</button>
      {topics && topics.map((topic, index) => (
        <Bubble
          key={topic.id}
          id={index}
          slug={topic.slug}
          title={topic.topic}
          content={topic.content}
          onClick={() => onPostClick(topic.slug)}
        />
      ))}
    </div>
  );
};

export default BubbleList;
