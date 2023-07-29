// src/pages/art/art.js
import TopicList from '@root/components/topicComponents/TopicList';
import React from 'react';
import Header from '@root/components/layout/Header';
import withCategoryStyles from '@root/components/cards/withCategoryStyles';

const Art = () => {
  
  return (
    
    <div>
      <Header/>
      <h1>Art Topics</h1>
      <TopicList category="art" />
    </div>
  );
};

export default withCategoryStyles(Art);