// src/pages/categories/topic/[id].js
import { getTopicById } from '@root/faunaClient';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw } from 'draft-js';

const TopicPage = ({ topic }) => {
  const contentState = convertFromRaw(JSON.parse(topic.data.content));
  const html = stateToHTML(contentState);

  return (
    <div>
      <h1>{topic.data.title}</h1>
      <p dangerouslySetInnerHTML={{ __html: html }} />
      {/* <p>{topic.data.content}</p> */}
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
