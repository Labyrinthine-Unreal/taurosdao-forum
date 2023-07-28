import {UAuthMoralisConnector} from '@uauth/moralis'

export const Metamask = {}

export const WalletConnect = {provider: 'walletconnect'}

UAuthMoralisConnector.setUAuthOptions({
  clientID: "ca98bdff-2938-4810-8813-68062d12997b",
  redirectUri: "https://taurosdao.app/",

  // Scope must include openid and wallet
  scope: 'openid wallet', 

  // Injected and walletconnect connectors are required
  connectors: {Metamask, WalletConnect},
})

export const UnstoppableDomains = {connector: UAuthMoralisConnector}

const connectors = {
    Metamask,
    WalletConnect,
    UnstoppableDomains
}


export default connectors
