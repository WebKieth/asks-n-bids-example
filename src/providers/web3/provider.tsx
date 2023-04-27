import { createContext, useContext, useEffect, useRef, useState } from "react";
import detectEthereumProvider from '@metamask/detect-provider';

import { BaseProviderProps } from "../typed";
import MetaMaskSDK from "@metamask/sdk";
import Web3 from 'web3'
import Web3Token from 'web3-token';

export interface MetaMaskEthereumProvider {
  isMetaMask?: boolean;
  once(eventName: string | symbol, listener: (...args: any[]) => void): this;
  on(eventName: string | symbol, listener: (...args: any[]) => void): this;
  off(eventName: string | symbol, listener: (...args: any[]) => void): this;
  addListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
  removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
  removeAllListeners(event?: string | symbol): this;
} 
export const Web3Context = createContext<{ token: string } | null>(null)

type ProviderProp = BaseProviderProps

export const Web3Provider = ({ children }: ProviderProp) => {
  const METAMASK_EXT_URL = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'
  const [detected, setDetected] = useState<MetaMaskEthereumProvider | null>(null);
  const [token, setToken] = useState('')
  const eth = useRef(new MetaMaskSDK().getProvider())
  const web3 = useRef()
  useEffect(() => {
    (async () => {
      const detectedProvider = await detectEthereumProvider()
      setDetected(detectedProvider)
      if (detectedProvider === null) return
      //@ts-ignore
      web3.current = new Web3(window.ethereum)
      await eth.current.request({ method: 'eth_requestAccounts'});
      //@ts-ignore
      const addr = (await web3.current.eth.getAccounts())[0]
       //@ts-ignore
      const token = await Web3Token.sign(msg => web3.current.eth.personal.sign(msg, addr), '1d');
      setToken(token)
    })()
  }, [])
  if (detected) {
    return <Web3Context.Provider value={{token}}>
      {children}
    </Web3Context.Provider>
  } else {
    return <div className="
      w-screen h-screen p-4 flex flex-col items-center justify-center
    ">
      <h1 className="text-xl mb-4">Metamask Wallet is not installed!</h1>
      <p>Please, <a className="
            text-blue-600 hover:text-blue-700
          "
          href={METAMASK_EXT_URL}
          target='_blank'
          rel='noopener noreferrer'
        >install metamask browser extension</a> and <span className="
            text-blue-600 hover:text-blue-700 cursor-pointer
          "
          onClick={() => window.location.reload()}
        >reload</span> the page.</p>
    </div>
  }
}

export const useWeb3Provided = () => useContext(Web3Context)