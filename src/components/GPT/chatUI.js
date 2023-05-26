import Head from "next/head";
import { useState, useEffect } from 'react';
import {Button} from '@chakra-ui/react'
export default function Chat() {
  const [data, setData] = useState( { text:'' });
  const [query, setQuery] = useState();
  const [search, setSearch] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (search) {
      setIsLoading(true);
      const res = await fetch(`/api/openai`, {
        body: JSON.stringify({
          name: search
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })
      const data = await res.json();
      setData(data);
      setIsLoading(false);
    }};

    fetchData();
  }, [search]);
  return (
    <div className={styles.container}>
      <Head>
        <title>TaurosDAO GPT-3</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

            <h3>Query GPT</h3>
            <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <Button
          type="button"
          onClick={() =>
            setSearch(query)
          }
        >
          Generate
        </Button>

          <h4>Response</h4>  
          {isLoading ? (
            <div>Loading ...</div>
         ) : (
           <span>
           {data.text}
           </span>
           )}

          </div>
  );
}