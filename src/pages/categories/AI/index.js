// src/pages/categories/AI/ai.js
import TopicList from '@root/components/topicComponents/TopicList';
import React from 'react';
import Header from '@root/components/layout/Header';
import withCategoryStyles from '@root/components/cards/withCategoryStyles';

const AI = () => {
  
  return (
    
    <div>
      <Header/>
      <h1>AI Topics</h1>
      <TopicList category="ai"/>
    </div>
  );
};

export default withCategoryStyles(AI);