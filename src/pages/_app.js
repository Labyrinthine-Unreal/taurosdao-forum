import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
// import {client} from "../client"
//  List pages you want to be publicly accessible, or leave empty if
//  every page requires authentication. Use this naming strategy:
//   "/"              for pages/index.js
//   "/foo"           for pages/foo/index.js
//   "/foo/bar"       for pages/foo/bar.js
//   "/foo/[...bar]"  for pages/foo/[...bar].js
const publicPages = ["/sign-in/[[...index]]", "/sign-up/[[...index]]"];

function MyApp({ Component, pageProps }) {
  // Get the pathname
  const { pathname } = useRouter();

  // Check if the current route matches a public page
  const isPublicPage = publicPages.includes(pathname);

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://graphql.us.fauna.com/graphql",
    headers: {
      authorization: `Bearer ${"fnAFC-8oHiAAUNEoQOqMs09rtY9ykV-6Z-iWUM9U"}`, //FaunaAdmin != manager_role
    },
  });


  // If the current route is listed as public, render it directly
  // Otherwise, use Clerk to require authentication
  return (
    // <ApolloProvider client={client} />
    <ClerkProvider pk_test_cGxlYXNhbnQtbW9jY2FzaW4tODYuY2xlcmsuYWNjb3VudHMuZGV2JA {...pageProps}>
      <ApolloProvider client={client} />

      {isPublicPage ? (
        <ApolloProvider client={client}>

          <Component {...pageProps} />
        </ApolloProvider>

      ) : (
        <>
          <ApolloProvider client={client}>
            <SignedIn>
              <Component {...pageProps} />
            </SignedIn>
          </ApolloProvider>

          <ApolloProvider client={client}>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </ApolloProvider>
        </>
      )}
    </ClerkProvider>


  );
}

export default MyApp;