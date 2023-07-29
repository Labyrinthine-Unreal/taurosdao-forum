// src/pages/categories//Marketplace/marketplace.js
import TopicList from '@root/components/topicComponents/TopicList';
import React from 'react';
import Header from '@root/components/layout/Header';
import withCategoryStyles from '@root/components/cards/withCategoryStyles';

const Marketplace = () => {
  
  return (
    
    <div>
      <Header/>
      <h1>Marketplace Topics</h1>
      <TopicList category="marketplace" />
    </div>
  );
};

export default withCategoryStyles(Marketplace);
