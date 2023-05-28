import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useRouter } from 'next/router';
import styles from './Bubble.module.css';

const Bubble = ({ slug, title, content }) => {
  const bubbleRef = useRef(null);
  const router = useRouter();
  
  useEffect(() => {
    gsap.set(bubbleRef.current, {
      left: `${Math.random() * 100}%`, // Random horizontal start position
      bottom: Math.random() * -100 + "vh", // Random vertical start position
    });
    
    const tlVertical = gsap.timeline({
      repeat: -1,
      delay: Math.random() * -5, // random start time between now and 5 seconds ago
    });

    tlVertical.to(bubbleRef.current, {
      y: "-100vh",
      duration: Math.random() * 7 + 3, // random duration between 3 and 7 seconds
      ease: "linear",
      repeat: -1, // repeat animation forever
    });

    const tlHorizontal = gsap.timeline({
      repeat: -1,
      yoyo: true,
      delay: Math.random() * 2, // random start time between now and 2 seconds ago
    });

    tlHorizontal.to(bubbleRef.current, {
      x: '+=50',
      duration: Math.random() * 2 + 1, // random duration between 1 and 3 seconds
      ease: "sine.inOut",
    });

  }, []);
  
  return (
    <div
      ref={bubbleRef}
      className={styles.bubble}
      onClick={() => router.push(`/topics/${slug}`)}
    >
      <h2>{title}</h2>
      {/* <p>{content}</p> */}
    </div>
  );
};

export default Bubble;
