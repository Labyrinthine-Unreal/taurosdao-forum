// src/pages/categories/general.js
import { useState, useEffect } from 'react';
import { createTopic, getTopicsByCategory } from '@root/faunaClient';
import CreateTopic from '@root/components/CreateTopic';
import Link from 'next/link';

const General = () => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const fetchedTopics = await getTopicsByCategory('general');
      setTopics(fetchedTopics);
    };
    fetchTopics();
  }, []);

  const handleNewTopic = async (newTopic) => {
    const topicId = await createTopic('general', newTopic.title, newTopic.content);
    if (topicId) {
      setTopics((prevTopics) => [...prevTopics, { ...newTopic, id: topicId }]);
    } else {
      console.error('Error creating topic');
    }
  };

  return (
    <div>
      <h1>General Topics</h1>
      <CreateTopic onSubmit={handleNewTopic} />
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            <Link href={`/categories/topic/${encodeURIComponent(topic.id)}`}>
              <div>
                <h2>{topic.title}</h2>
                <p>
                  {topic.content.substring(0, 100)}
                  {topic.content.length > 100 ? '...' : ''}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default General;
