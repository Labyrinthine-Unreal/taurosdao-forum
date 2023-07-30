import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '@root/styles/globals.css'
import { MoralisProvider } from "react-moralis"
import React, { Children } from "react";
import { createClient, configureChains, } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { mainnet, goerli, sepolia } from 'wagmi/chains'
import { WagmiConfig } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
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

  const { provider, webSocketProvider, chains } = configureChains(
    [mainnet],
    [
      // alchemyProvider({ apiKey: 'hu9KmpMxud_8q6Tlskrt42zOpiGy-9xN' }),
      infuraProvider({ apiKey: '4cb849430aaa4b82bb8360011eb397e9' }),
      publicProvider()
    ],
    // { targetQuorum: 2 },
  )

  // Necessary for Wagmi Client Provider /* Do Not Delete or client will not work*/
  const wClient = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      // new CoinbaseWalletConnector({
      //   chains,
      //   options: {
      //     appName: 'TaurosDAO',
      //   },
      // }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: 'Injected',
          shimDisconnect: true,
        },
      }),
    ],
    provider,
    webSocketProvider,
  })

  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  // If the current route is listed as public, render it directly
  // Otherwise, use Clerk to require authentication



  return (
    <WagmiConfig client={wClient}>
      <ApolloProvider client={client}>
      <MoralisProvider appId="ny6Iude7WFwg2QaZtvDK7zQC81e9uKRIeaCkFNxM" serverUrl="https://htogiwbd7il5.usemoralis.com:2053/server">
        <Component {...pageProps} />
      </MoralisProvider>
      </ApolloProvider>
    </WagmiConfig>



    // return (
    //   <WagmiConfig client={wClient}>
    //    <ApolloProvider client={client} />
    //   {/* <ClerkProvider publishableKey={pubKey} {...pageProps}> */}
    //   <MoralisProvider appId="ny6Iude7WFwg2QaZtvDK7zQC81e9uKRIeaCkFNxM" serverUrl="https://htogiwbd7il5.usemoralis.com:2053/server">

    //     <ApolloProvider client={client} />

    //     {isPublicPage ? (
    //       <ApolloProvider client={client}>

    //         <Component {...pageProps} />
    //       </ApolloProvider>

    //     ) : (
    //       <>
    //         <ApolloProvider client={client}>
    //           <SignedIn>
    //             <Component {...pageProps} />
    //           </SignedIn>
    //         </ApolloProvider>

    //         <ApolloProvider client={client}>
    //           <SignedOut>
    //             <RedirectToSignIn />
    //           </SignedOut>
    //         </ApolloProvider>
    //       </>
    //     )}
    //     </MoralisProvider>
    //   {/* </ClerkProvider> */}
    //   </WagmiConfig>


  );
}

export default MyApp;