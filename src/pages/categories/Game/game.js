// src/pages/categories/Game/game.js
import TopicList from '@root/components/topicComponents/Game/TopicList';
import React from 'react';
import Header from '@root/components/layout/Header';
import withCategoryStyles from '@root/components/cards/withCategoryStyles';

const Game = () => {
  
  return (
    
    <div>
      <Header/>
      <h1>Game Topics</h1>
      <TopicList/>
    </div>
  );
};

export default withCategoryStyles(Game);
