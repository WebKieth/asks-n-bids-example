import { createContext, useEffect, useState } from "react";
import detectEthereumProvider from '@metamask/detect-provider';

import { BaseProviderProps } from "../typed";

export interface MetaMaskEthereumProvider {
  isMetaMask?: boolean;
  once(eventName: string | symbol, listener: (...args: any[]) => void): this;
  on(eventName: string | symbol, listener: (...args: any[]) => void): this;
  off(eventName: string | symbol, listener: (...args: any[]) => void): this;
  addListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
  removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
  removeAllListeners(event?: string | symbol): this;
  enable: Promise<any>
} 
export const Web3Context = createContext<MetaMaskEthereumProvider | undefined>(undefined)

type ProviderProp = BaseProviderProps

export const Web3Provider = ({ children }: ProviderProp) => {
  const METAMASK_EXT_URL = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'
  const [detected, setDetected] = useState<MetaMaskEthereumProvider | null>(null);
  useEffect(() => {
    (async () => {
      const detectedProvider = await detectEthereumProvider()
      //@ts-ignore
      setDetected(detectedProvider)
      //@ts-ignore
      if (detectedProvider !== null) await detectedProvider.enable()
    })()
  }, [])
  if (detected) {
    return <Web3Context.Provider value={detected}>
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