// src/pages/categories/Blockchain/blockchain.js
import TopicList from '@root/components/topicComponents/Blockchain/TopicList';
import React from 'react';
import Header from '@root/components/layout/Header';
import withCategoryStyles from '@root/components/cards/withCategoryStyles';

const Blockchain = () => {
  
  return (
    
    <div>
      <Header/>
      <h1>Blockchain Topics</h1>
      <TopicList/>
    </div>
  );
};

export default withCategoryStyles(Blockchain);
