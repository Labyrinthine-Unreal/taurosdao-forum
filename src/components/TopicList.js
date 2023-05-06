import React from "react";
import gql from "graphql-tag";
import { ApolloProvider } from "@apollo/client";
import { useQuery } from "@apollo/react-hooks";
import { useEffect, useState } from 'react';
import { useLoadingEffect,useLoading,LoadingProvider } from "./loading";

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
 const [setData] = useState([])
 const { data, loading, error } = useQuery(ITEMS_QUERY,
  {
    refetchQueries: [{ query: ITEMS_QUERY }]
  });
 console.log(data)

 if (loading) return 'Loading...';
 if (error) return `Error! ${error.message}`;


  return (
        <>
        <div style={{ padding: "10px" }}>
      {data.topics_by_id.data.map((item) => {
        return <li>{item.topic}:{item.content}</li>;
      })}
      </div>
      </> 
  );
  }