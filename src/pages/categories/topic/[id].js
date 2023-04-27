// src/pages/categories/topic/[id].js
import { getTopicById } from '@root/faunaClient';

const TopicPage = ({ topic }) => {
  return (
    <div>
      <h1>{topic.data.title}</h1>
      <p>{topic.data.content}</p>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const { id } = params;
  const decodedId = decodeURIComponent(id);
  const topic = await getTopicById(decodedId);

  if (!topic) {
    return {
      notFound: true,
    };
  }

  return {
    props: { topic },
  };
}

export default TopicPage;
