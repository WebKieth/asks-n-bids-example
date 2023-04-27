import { useContext } from "react"
import { MetaMaskEthereumProvider, Web3Context } from "./provider"

export const useWeb3Provided = (): MetaMaskEthereumProvider | undefined => {
  return useContext(Web3Context)
}