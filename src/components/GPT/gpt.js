import { useState } from 'react'
import { Box, Button, Flex, Spacer, Center, Grid, HStack, SimpleGrid, Text, Link, Heading, Collapse, useDisclosure, IconButton } from '@chakra-ui/react'
// import { Textarea } from '@nextui-org/react';
import faunadb from 'faunadb';
import { ClerkProvider, useUser, SignIn, SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'

export default function GPT() {
  const q = faunadb.query;
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const { user } = useUser()

  const client = new faunadb.Client({ domain: "db.us.fauna.com", secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, keepAlive: true });

  const getResponseFromOpenAI = async () => {
    setResponse("");
    console.log("Getting response from OpenAI...");
    setIsLoading(true);
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),

    });
    String.prototype.format = function () {
      var i = 0, args = arguments;
      return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
      });
    };
    const data = await response.json();
    setIsLoading(false);
    console.log(data.text);
    setResponse(data.text);
    var createP = client.query(
      q.Create(
        q.Collection('Prompts'),
        { data: { user: user.username, query: prompt, prompt: "{}:".format(user.username) + prompt + "{}".format(data.text), GPTresponse: data.text, date: new Date().toString() } }
      ))
    createP.then(function (response) {
      console.log(response.ref); // Logs the ref to the console.
      // onPostCreated(response.data); // Call the callback with the new post data
      // router.push(`/topics/${response.data.slug}`); // Redirect the user to the new topic's page
    })
  };

  return (
    <Center>
      {/* <Text>After Reading Whitepaper feel free to ask ChatGPT any questions about blockchain operations.</Text> */}
      <Spacer />
      {/* <div className={styles.center}> */}

      <input status="secondary"
        placeholder="Enter a prompt"
        onChange={(e) => setPrompt(e.target.value)}
        row="5"
        cols="50"

      />
      <Button onClick={getResponseFromOpenAI}>
        Get Response
      </Button>

      <div>
        {isLoading ? (
          <div>Waiting for response ...</div>
        ) : (
          <div>{response}</div>
        )}
      </div>
      {/* </div> */}
    </Center>
  )
}