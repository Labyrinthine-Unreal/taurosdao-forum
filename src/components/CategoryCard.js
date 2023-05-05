// src/components/CategoryCard.js
import React, { forwardRef } from 'react';
import Link from 'next/link';
import styles from '@root/styles/Home.module.css';

// eslint-disable-next-line react/display-name
const CategoryCard = forwardRef(({ title, link, index, handleCardMouseEnter, handleCardMouseLeave }, ref) => {
  return (
    <Link href={link}>
      <div
        className={`${styles.categoryCard} ${styles.categoryTitle}`}
        onMouseEnter={() => handleCardMouseEnter(index)}
        onMouseLeave={() => handleCardMouseLeave(index)}
        ref={ref}
      >
        <h2>{title}</h2>
      </div>
    </Link>
  );
});

export default CategoryCard;

