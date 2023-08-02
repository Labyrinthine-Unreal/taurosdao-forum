import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import faunadb from 'faunadb';

const q = faunadb.query;
const client = new faunadb.Client({ domain: "db.us.fauna.com", secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY, keepAlive: true });


const Button = ({ increment, onClickFunction }) => {
    const router = useRouter();
    const { slug, category } = router.query; // Get the category from the URL

    // Adjust the query to use the category
    const GET_TOPIC_BY_SLUG = gql`
      query MyTopicQuery($slug: String!){
        ${category}_by_slug(slug: $slug) {
          _id
          slug
          topic
          content
          user
          eth_address
        }
      }
    `;

    // Fetch the topic data based on the slug using Apollo Client
    const { data, loading, error } = useQuery(GET_TOPIC_BY_SLUG, {
        variables: { slug },
        skip: !slug,
        // Skip the query if the slug is not available
    });


    // Render the topic data
    const topicData = data?.[`${category}_by_slug`];
    const id = topicData._id
    const [count, setCount] = useState(0)

    const incrementCount = increment => {
        setCount(count + increment)
    }
    console.log(incrementCount)
    const handleClick = () => {
        onClickFunction(increment)
    }
    return (<button onClick={handleClick}>+{increment}</button>
    )
}

const UpvotePost = () => {
    const [count, setCount] = useState(0)

    const incrementCount = increment => {
        setCount(count + increment)
    }

    const router = useRouter();
    const { slug, category } = router.query; // Get the category from the URL

    // Adjust the query to use the category
    const GET_TOPIC_BY_SLUG = gql`
      query MyTopicQuery($slug: String!){
        ${category}_by_slug(slug: $slug) {
          _id
          slug
          topic
          content
          user
          eth_address
        }
      }
    `;

    // Fetch the topic data based on the slug using Apollo Client
    const { data, loading, error } = useQuery(GET_TOPIC_BY_SLUG, {
        variables: { slug },
        skip: !slug,
        // Skip the query if the slug is not available
    });


    // Render the topic data
    const topicData = data?.[`${category}_by_slug`];
    const id = topicData._id


    var createP =
        client.query(
            q.Update(
                q.Ref(q.Collection(category), id),
                { data: {upvote:count} } //LOOK HERE <==
            )
        )
    createP.then(function (response) {
        console.log(response.ref); // Logs the ref to the console.
        // onPostCreated(response.data.data); // Call the callback with the new post data
        // router.push(`/${category}/${response.data.slug}`); // Redirect the user to the new topic's page
    })

    console.log(count)


    return (
        <div>
            <Button increment={1} onClickFunction={incrementCount} />
            <Button increment={10} onClickFunction={incrementCount} />
            <Button increment={100} onClickFunction={incrementCount} />
            <Button increment={1000} onClickFunction={incrementCount} />
            <span>{count}</span>
        </div>
    )
}
export default UpvotePost;