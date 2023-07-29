// src/pages/[category]/index.js
import TopicList from '@root/components/topicComponents/TopicList';
import React from 'react';
import Header from '@root/components/layout/Header';
import withCategoryStyles from '@root/components/cards/withCategoryStyles';
import { useRouter } from 'next/router';

const Category = () => {
  const router = useRouter();
  const { category } = router.query; // Get the category from the URL

  return (
    <div>
      <Header/>
      <h1>{category.charAt(0).toUpperCase() + category.slice(1)} Topics</h1>
      <TopicList category={category} />
    </div>
  );
};

export default withCategoryStyles(Category);
