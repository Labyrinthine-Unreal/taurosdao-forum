import { Box } from '@chakra-ui/react'
import styles from '@styles/SignIn.module.css'
import { useMoralis } from "react-moralis"
import Connect from './ConnectButton'
import Disconnect from './DisconnectButton'


export default function Wallets() {
  const { isAuthenticated } = useMoralis()

  return (
    <Box className={styles.connect}>
    {isAuthenticated ? <Disconnect /> : <Connect />}
    </Box>
  )
}