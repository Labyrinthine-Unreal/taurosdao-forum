# taurosdao-forum


>app/
FAUNA_DB_SECRET="fnAFClf-6BAATcIrDU1kFAR-2IpS1I3oRwlLYVAd"


-> Secured usesr registry via Clerk, data will be logged to faunadb

>src/components/createTopic
> User Creates Topic&Content data
	- data is stored to faunaDB via fauna Secret Key

>src/components/topicList
	- TODO: Fetch topics_by_id data to frontend
>pages/api/currentUser
-> clerk/NextJS usesr AUTH API, *experimental/.. unnecessary* 

>pages/_app.js 
-> Provide Clerk API key
-> FaunaDB will stored secured user login to topics collection

> pages/index.js #line55
-> "test" collection is where we currently store user data for testing purposes
