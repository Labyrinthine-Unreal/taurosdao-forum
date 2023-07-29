// src/pages/blockchain/blockchain.js
import TopicList from '@root/components/topicComponents/TopicList';
import React from 'react';
import Header from '@root/components/layout/Header';
import withCategoryStyles from '@root/components/cards/withCategoryStyles';

const Blockchain = () => {
  
  return (
    
    <div>
      <Header/>
      <h1>Blockchain Topics</h1>
      <TopicList category="blockchain" />
    </div>
  );
};

export default withCategoryStyles(Blockchain);
