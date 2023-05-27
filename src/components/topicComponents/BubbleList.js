// src/components/topicComponents/BubbleList.js
import Bubble from './Bubble';
import { useRouter } from 'next/router';

const BubbleList = ({topics, switchView}) => {
    console.log(topics);
  const router = useRouter();

  const onPostClick = (slug) => {
    router.push(`/topics/${slug}`);
  };

  return (
    <div className="bubble-container">
      <button onClick={ switchView }>Switch to List View</button>
      {topics && topics.map((topic) => (
        <Bubble
          key={topic.slug}
          slug={topic.slug}
          title={topic.topic}
          onClick={() => onPostClick(topic.slug)}
        />
      ))}
    </div>
  );
};

export default BubbleList;

