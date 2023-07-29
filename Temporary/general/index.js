// src/pages/forum/forum.js
import TopicList from '@root/components/topicComponents/TopicList';
import React from 'react';
import Header from '@root/components/layout/Header';
import withCategoryStyles from '@root/components/cards/withCategoryStyles';

const Forum = () => {
  
  return (
    
    <div>
      <Header/>
      <h1>General Topics</h1>
      <TopicList category="general" />
    </div>
  );
};

export default withCategoryStyles(Forum);