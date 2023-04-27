// src/components/TopicList.js
import Link from 'next/link';

const TopicList = ({ topics }) => {
  return (
    <div>
      <h2>Topics</h2>
      <ul>
        {topics.map((topic) => (
          <li key={topic.ref.id}>
            <Link href={`/categories/topic/${encodeURIComponent(topic.ref.id)}`}>
              <span className="topic-link">{topic.data.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .topic-link {
          cursor: pointer;
          text-decoration: underline;
          color: blue;
        }
      `}</style>
    </div>
  );
};

export default TopicList;
