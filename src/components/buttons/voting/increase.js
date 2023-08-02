import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import { useUser } from '@clerk/nextjs';
import parse from 'html-react-parser';
import Header from '@root/components/layout/Header';
// import styles from '../TopicPage.module.css';
// import UpdateTopic from '@root/components/topicComponents/UpdateTopic';
import faunadb from 'faunadb';
import CommentList from '@root/components/commentComponents/CommentList';
import { CSSTransition } from 'react-transition-group';
import ReplyButton from '@root/components/buttons/ReplyButton';
import GPT from '@root/components/GPT/gpt';
import { useAccount } from 'wagmi'
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const q = faunadb.query;
const client = new faunadb.Client({ domain: "db.us.fauna.com", secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, keepAlive: true });

const IncButton = ({ increment, onClickFunction }) => {
    
  const handleClick = () => {
    onClickFunction(increment)
  }

  return <button onClick={handleClick}>+{increment}</button>
}

export default IncButton;