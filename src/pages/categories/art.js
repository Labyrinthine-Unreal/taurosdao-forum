import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from "@apollo/react-hooks";
import gql from 'graphql-tag';
import TopicList from '@root/components/topicComponents/TopicList';
import BubbleList from '@root/components/topicComponents/BubbleList';
import Header from '@root/components/layout/Header';
import withCategoryStyles from '@root/components/cards/withCategoryStyles';
import faunadb from 'faunadb';

const ITEMS_QUERY = gql`
  query MyTopicQuery {
    topics_by_id(_size:100){
      data {
        _id
        topic 
        content
        user
        slug
      }
    }
  }
`;

const Art = () => {
  const [viewMode, setViewMode] = useState('list');  // initial view mode is 'list'
  const [topics, setTopics] = useState([]);
  const { loading, error, data } = useQuery(ITEMS_QUERY);

  const client = useMemo(() => new faunadb.Client({ domain:"db.us.fauna.com", secret: "fnAFE6V8EKAASSWA304UUK2Dw0yczeBiSbEPoJJ4", keepAlive: true }), []);

  useEffect(() => {
    if (data && data.topics_by_id) {
      setTopics(data.topics_by_id.data);
    }
  }, [data]);

  const switchToListView = () => {
    setViewMode('list');
  };

  const switchToBubbleView = () => {
    setViewMode('bubble');
  };

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <Header />
      <h1>Art</h1>
      {viewMode === 'list' && <TopicList topics={topics} switchView={switchToBubbleView} />}
      {viewMode === 'bubble' && <BubbleList topics={topics} switchView={switchToListView} />}
    </div>
  );
};

export default withCategoryStyles(Art);
