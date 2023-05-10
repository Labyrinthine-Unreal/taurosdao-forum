// src/pages/index.js
import React from 'react';
import Header from '@root/components/Header';
import CategoryCard from '@root/components/CategoryCard';
import styles from '@root/styles/Home.module.css'

export default function Home(req, res) {
  const categories = [
    { title: 'Art', link: '/categories/art', index: 0 },
    { title: 'Blockchain', link: '/categories/blockchain', index: 1 },
    { title: 'Game', link: '/categories/game', index: 2 },
    { title: 'Marketplace', link: '/categories/marketplace', index: 3 },
    { title: 'AI', link: '/categories/ai', index: 4 },
    { title: 'Forum', link: '/categories/forum', index: 5 }
  ];

  const categoryCardsRef = categories.map(() => React.createRef());
  
  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.gridContainer}>
          {categories.map((category) => (
              <CategoryCard
                key={category.index}
                ref={categoryCardsRef[category.index]}
                title={category.title}
                link={category.link}
                index={category.index}
              />
            ))}
          </div>
      </div>
    </div>
  );
}
