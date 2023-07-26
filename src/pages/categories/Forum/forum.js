// src/pages/categories/forum.js
import TopicList from '@root/components/topicComponents/Forum/TopicList';
import React from 'react';
import Header from '@root/components/layout/Header';
import withCategoryStyles from '@root/components/cards/withCategoryStyles';

const Forum = () => {
  
  return (
    
    <div>
      <Header/>
      <h1>Forum Topics</h1>
      <TopicList/>
    </div>
  );
};

export default withCategoryStyles(Forum);