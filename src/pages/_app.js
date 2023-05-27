import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '@root/styles/globals.css'
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
      authorization: `Bearer ${process.env.NEXT_PUBLIC_FAUNA_SECRET_KEY}`, //FaunaAdmin != manager_role
    },
  });


  // If the current route is listed as public, render it directly
  // Otherwise, use Clerk to require authentication
  const pubKey= process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  
  return (
    // <ApolloProvider client={client} />
    <ClerkProvider publishableKey={pubKey} {...pageProps}>
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