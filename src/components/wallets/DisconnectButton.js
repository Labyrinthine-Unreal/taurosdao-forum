import { Flex, Center, Button, Icon } from '@chakra-ui/react'
import styles from '@styles/SignIn.module.css'
import { useMoralis } from "react-moralis"
import { AiOutlineWallet } from 'react-icons/ai'
import { useEffect, useState, } from "react";
import { UAuthMoralisConnector } from '@uauth/moralis';


export default function Disconnect() {
  const { refetchUserData, isInitialized, isUserUpdating, userError, isAuthenticated, 
    authenticate, Moralis, account, user, logout, isLoggingOut } = useMoralis();
  
  // Displays the change of the UD domain name @theConnectedUser, or wallet address.
  const [theConnectedUser, setConnectedUser] = useState();
  const [shortWallet, setWalletAddress] = useState();


  // Gets state in local storage and sets it after refresh 
  useEffect(() => {
    const sessionWallet = window.localStorage.getItem('WALLET_ADDRESS');
    const userDomain = window.localStorage.getItem('UD_DOMAIN');
    if (sessionWallet != null) {
      setWalletAddress(sessionWallet);
    };
    if (userDomain != null) {
      setConnectedUser(userDomain);      
    }
    
  }, [isInitialized])

  // Sets state after authentication 
  useEffect(() => {
    if (account != null) {
    const sessionWallet = getShortenAddress(account);
    window.localStorage.setItem('WALLET_ADDRESS', sessionWallet);
    setWalletAddress(sessionWallet);
    console.log(sessionWallet);    
    }        
  }, [account])

  
  // DISCONNECT
  async function handleDisconnect() {
    try {
      logout();
      window.localStorage.removeItem('WALLET_ADDRESS');
      window.localStorage.removeItem('UD_DOMAIN');
    } catch (error) {
      console.error(error)
    }
  }

  function getUdUserInfo() {
    try {
      const uAuthMoralisConnector = new UAuthMoralisConnector();
      uAuthMoralisConnector.uauth.user().then((user) => {
        // Sets useState of UD domain name.
        window.localStorage.setItem('UD_DOMAIN', user.sub);
        setConnectedUser(user.sub);
      }).catch((error) => {
        console.log(error)
      });
    } catch (error) {
      console.log(error)
    }
  }

  // Shorten Address Display
  function getShortenAddress(account) {
    if (typeof account === "string") {
      const firstCharacters = account.substring(0, 6)
      const lastCharacters = account.substring(account.length - 4, account.length)
      return `${firstCharacters}...${lastCharacters}`;
    }
  }

  
  
if (isAuthenticated){
  getUdUserInfo();
  return (
    <Flex className={styles.connect}>
        <Center>
            {<Center 
            fontSize={14} 
            fontWeight="semibold" 
            bg="#009688bb" 
            color="#fff" 
            border="1px" 
            _hover={{bg: "teal.400"}}  
            position="absolute"
            w="fit-content" 
            h="40px"
            right={110}
            py={3}
            pl={3}
            pr={8}
            rounded="3xl"
            >
            <Icon display={{ base: "none", md: "flex" }} fontSize={17} fontWeight="semibold" mr={2} as={AiOutlineWallet} />

            {theConnectedUser ? theConnectedUser : shortWallet }
            
            </Center>}
            <Button onClick={handleDisconnect}>t</Button>
        </Center>
    </Flex>
  )
            }
}