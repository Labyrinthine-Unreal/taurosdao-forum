export default async (req, res) => {
    const client = new faunadb.Client({ secret:"fnAFClf-6BAATcIrDU1kFAR-2IpS1I3oRwlLYVAd", keepAlive: false });
  
    if (req.method == 'GET') {
      let query = await client.query(
        q.Map(
          q.Paginate(q.Documents(q.Collection('topics'))),
          q.Lambda((show) => q.Get(show))
        )
      );
      res.status(200).json({ data: query.data });
    }
  };