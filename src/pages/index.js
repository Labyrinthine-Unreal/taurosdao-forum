import React, { useState } from 'react';
import Header from '@root/components/layout/Header';
import CategoryCard from '@root/components/cards/CategoryCard';
import SEO from '@root/components/layout/SEO';
import AuthorInput from '@root/components/layout/AuthorInput'; // Import the AuthorInput component
import styles from '@root/styles/Home.module.css';

export default function Home() {
  const categories = [
    { title: 'Art', link: '/art', index: 0 },
    { title: 'Blockchain', link: '/blockchain', index: 1 },
    { title: 'Game', link: '/game', index: 2 },
    { title: 'Marketplace', link: '/marketplace', index: 3 },
    { title: 'AI', link: '/ai', index: 4 },
    { title: 'Forum', link: '/general', index: 5 },
  ];

  const [authorNames, setAuthorNames] = useState({}); // State to store author names

  const categoryCardsRef = categories.map(() => React.createRef());

  const handleAuthorNameChange = (category, name) => {
    setAuthorNames((prevAuthorNames) => ({
      ...prevAuthorNames,
      [category]: name,
    }));
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.gridContainer}>
          {categories.map((category) => (
            <React.Fragment key={category.index}>
              <AuthorInput
                defaultValue={authorNames[category.title]}
                onUpdate={(name) => handleAuthorNameChange(category.title, name)}
              />
              {/* Use the SEO component to set metadata for each category */}
              <SEO
                title={`${category.title} Category`}
                description={`Explore ${category.title} topics and discussions by ${authorNames[category.title] || 'Your Name'}.`}
                keywords={`${category.title}, topics, discussions, ${authorNames[category.title] || 'Your Name'}`}
                author={authorNames[category.title] || 'Your Name'}
              />
              <CategoryCard
                key={category.index}
                ref={categoryCardsRef[category.index]}
                title={category.title}
                link={category.link}
                index={category.index}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
