from faunadb import query as q
from faunadb.client import FaunaClient
from faunadb.objects import Ref
from faunadb.errors import BadRequest, NotFound

client = FaunaClient(secret="fnAFDZGm3pAASZlfCHemrt0fvXUPK1gb0ZqnbR6f",domain="db.us.fauna.com")

n_posts = client.query(q.paginate(q.match(q.ref("indexes/topics_by_id"))))

# print(n_posts)



result = client.query(
    q.count(q.match(q.collection("topics"),"364194686456299600"))
)
print(result)
# print(n_posts["data"])






