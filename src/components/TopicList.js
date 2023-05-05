// src/components/TopicList.js
import React from "react";
import gql from "graphql-tag";
import { ApolloProvider } from "@apollo/client";
import { useQuery } from "@apollo/react-hooks";
import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw } from 'draft-js';

function isValidJSON(jsonString) {
  try {
    JSON.parse(jsonString);
  } catch (e) {
    return false;
  }
  return true;
}

const ITEMS_QUERY = gql`
query MyTopicQuery {
  topics_by_id {
    data {
      topic 
      content
    }
  }
 }
`;
console.log(ITEMS_QUERY)

export default function TopicList() {
 const { data, loading, error } = useQuery(ITEMS_QUERY);
 console.log(data)

 if (loading) return 'Loading...';
 if (error) return `Error! ${error.message}`;


  return (
        <>
        <div style={{ padding: '10px' }}>
        {data.topics_by_id.data.map((item) => {
          if (!isValidJSON(item.content)) {
            return (
              <li key={item.id}>
                {item.topic}: Invalid content format (not valid JSON).
              </li>
            );
          }
          const contentState = convertFromRaw(JSON.parse(item.content));
          const html = stateToHTML(contentState);
          return (
            <li key={item.id}>
              {item.topic}: <span dangerouslySetInnerHTML={{ __html: html }} />
            </li>
          );
        })}
      </div>
        {/* <div style={{ padding: "10px" }}>
      {data.topics_by_id.data.map((item) => {
        return <li key={item.id}>{item.topic}:{item.content}</li>;
      })}
      </div> */}
      </> 
  );
  }