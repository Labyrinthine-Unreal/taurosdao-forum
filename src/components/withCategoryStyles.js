import React from 'react';
import styles from './CategoryStyles.module.css';

const withCategoryStyles = (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => (
    <div className={styles.categoryContainer}>
      <WrappedComponent {...props} />
    </div>
  );
};

export default withCategoryStyles;
