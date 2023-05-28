import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useRouter } from 'next/router';
import { motion, useAnimation } from 'framer-motion';
import styles from './Bubble.module.css';
import styles3D from './Bubble3D.module.css';
import { set } from 'draft-js/lib/DefaultDraftBlockRenderMap';

const Bubble = ({ slug, title, content }) => {
  const bubbleRef = useRef(null);
  const router = useRouter();
  const controls = useAnimation();

  const colors = ["#ff7f7f", "#7fff7f", "#7f7fff", "yellow", "orange", "pink"];
  const color = colors[Math.floor(Math.random() * colors.length)]; // select
  
  useEffect(() => {
    gsap.set(bubbleRef.current, {
      backgroundColor: color, // set the selected color
      left: `${Math.random() * 100}%`, // Random horizontal start position
      top: `${Math.random() * 50 + 50}%`, // Random vertical start position between 50% and 100%
    });

    const tlVertical = gsap.timeline({
      repeat: -1,
      delay: Math.random() * -5, // random start time between now and 5 seconds ago
      onRepeat: function() {
        gsap.set(bubbleRef.current, {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 50 + 50}%`,
        });
      }
    });

    tlVertical.to(bubbleRef.current, {
      top: "-100%", // move to the top of the screen
      duration: Math.random() * 10 + 6, // random duration between 3 and 10 seconds
      ease: "linear",
    });

    const tlHorizontal = gsap.timeline({
      repeat: -1,
      yoyo: true,
      delay: Math.random() * 4, // random start time between now and 2 seconds ago
    });

    tlHorizontal.to(bubbleRef.current, {
      left: `+=${Math.random() > 0.5 ? '-' : ''}50%`, // move left or right by 50%
      duration: Math.random() * 4 + 2, // random duration between 1 and 3 seconds
      ease: "sine.inOut",
    });

  }, []);

  const handleClick = () => {
    controls.start({
      scale: 100,
      transition: { duration: 5 },
    })
  
    // navigate after animation completes
    setTimeout(() => {
      router.push(`/topics/${slug}`);
    }, 500);
  };

  return (
    <motion.div
      ref={bubbleRef}
      className={styles.bubble} 
      onClick={handleClick}
      animate={controls}
    >
      <h2>{title}</h2>
    </motion.div>
  );
};

export default Bubble;
