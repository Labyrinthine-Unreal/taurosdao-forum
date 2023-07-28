// src/components/buttons/gameReplyButton.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from '@fortawesome/free-solid-svg-icons';
import styles from './ReplyButton.module.css';
import CreateComment from '@root/components/commentComponents/CreateComment';
import { CSSTransition } from 'react-transition-group';

const ReplyButton = () => {
    const [showReply, setShowReply] = useState(false);

    const handleReplyToggle = () => {
        setShowReply(prevState => !prevState);
      }

    return (
        <>
            <button className={styles.replyButton} onClick={handleReplyToggle}><FontAwesomeIcon icon={faReply} style={{ marginRight: "20px" }} />Post Reply</button>
            <CSSTransition
                in={showReply}
                timeout={300}
                classNames="slide"
                unmountOnExit
            >
            <CreateComment category="game" setShowReply={setShowReply} />
            </CSSTransition>
        </>
    )
}

export default ReplyButton;