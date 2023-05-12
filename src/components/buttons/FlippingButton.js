// src/components/FlippingButton.js
import React from 'react';
import styles from './FlippingButton.module.css';

const FlippingButton = ({ text, front, back, onClick }) => {
  return (
    <div style={{ display: 'block', textAlign: 'center', margin: '10px 0' }}>
      <button className={styles.btn} onClick={onClick}>
        <span className={styles.text}>{text}</span>
        <span className={styles.flipFront}>{front}</span>
        <span className={styles.flipBack}>{back}</span>
      </button>
    </div>
  );
};

export default FlippingButton;
