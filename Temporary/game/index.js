// src/pages/game/game.js
import TopicList from '@root/components/topicComponents/TopicList';
import React from 'react';
import Header from '@root/components/layout/Header';
import withCategoryStyles from '@root/components/cards/withCategoryStyles';

const Game = () => {
  
  return (
    
    <div>
      <Header/>
      <h1>Game Topics</h1>
      <TopicList category="game" />
    </div>
  );
};

export default withCategoryStyles(Game);
