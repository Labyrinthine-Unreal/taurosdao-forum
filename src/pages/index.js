import React from 'react';
import Header from '@root/components/layout/Header';
import CategoryCard from '@root/components/cards/CategoryCard';
import SEO from '@root/components/layout/SEO'; // Import the SEO component
import styles from '@root/styles/Home.module.css'

export default function Home(req, res) {
  const categories = [
    { title: 'Art', link: '/art', index: 0 },
    { title: 'Blockchain', link: '/blockchain', index: 1 },
    { title: 'Game', link: '/game', index: 2 },
    { title: 'Marketplace', link: '/marketplace', index: 3 },
    { title: 'AI', link: '/ai', index: 4 },
    { title: 'Forum', link: '/general', index: 5 }
  ];

  const categoryCardsRef = categories.map(() => React.createRef());
  
  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.gridContainer}>
          {categories.map((category) => (
            <React.Fragment key={category.index}>
              {/* Use the SEO component to set metadata for each category */}
              <SEO
                title={`${category.title} Category`}
                description={`Explore ${category.title} topics and discussions.`}
                keywords={`${category.title}, topics, discussions`}
                author="Your Name" // Set your name or the site's author here
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
