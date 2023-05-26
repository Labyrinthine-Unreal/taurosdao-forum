// src/faunaClient.js
import { Client, query as q } from 'faunadb';

export const faunaClient = new Client({
domain:"db.us.fauna.com",
  domain:"db.us.fauna.com", secret: process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY,
});

export async function createTopic(category, title, content) {
  try {
    const result = await faunaClient.query(
      q.Create(q.Collection('topics'), {
        data: { category, title, content },
      })
    );
    return result.ref.id;
  } catch (error) {
    console.error('Error creating topic:', error);
    return null;
  }
}

export async function getTopicsByCategory(category) {
    try {
      const result = await faunaClient.query(
        q.Map(
          q.Paginate(q.Match(q.Index('topics_by_category'), category)),
          q.Lambda('topicRef', q.Get(q.Var('topicRef')))
        )
      );
      return result.data.map((topic) => topic.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
      return [];
    }
  }

  export async function getTopicById(id) {
    try {
      const result = await faunaClient.query(
        q.Get(q.Match(q.Index('topics_by_id'), id))
      );
      return result.data;
    } catch (error) {
      console.error('Error fetching topic:', error);
      return null;
    }
  }
