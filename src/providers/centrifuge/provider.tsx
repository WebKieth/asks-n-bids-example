import { ReactNode, createContext, useEffect } from "react";
import { Centrifuge, SubscribingContext } from 'centrifuge';

type TCentrifugeContext = {
  addSubscription: (name: string) => void,
  removeSubscription: (name: string) => void,
}

const CentrifugeContext = createContext<TCentrifugeContext | null>(null)

export const CentrifugeProvider = ({ children }: { children: ReactNode }) => {

  const centrifuge = new Centrifuge('wss://api.testnet.rabbitx.io/ws', {debug: true});
  const subsctiptions = centrifuge.subscriptions()

  const createSubscription = (name: string, resubscribe = false) => {
    if (Object.keys(subsctiptions).includes(name)) {
      if (resubscribe === false) return
      subsctiptions[name].unsubscribe()
    }
    const sub = centrifuge.newSubscription(name)
    sub.on('subscribing', handleSocketEvent)
    sub.subscribe()
    return sub
  }

  const removeSubscription = (name: string) => {
    const index = Object.keys(subsctiptions).indexOf(name)
    if (index === -1) return
    const sub = subsctiptions[index]
    sub.unsubscribe()
    sub.removeAllListeners()
  }

  const handleSocketEvent = (ctx: SubscribingContext) => {
    console.log('subscribing...', ctx)
  }

  useEffect(() => {
    centrifuge.connect()
    createSubscription('orderbook:BTC')
  }, [])


  return <CentrifugeContext.Provider value={{
    addSubscription: createSubscription,
    removeSubscription
  }}>
    {children}
  </CentrifugeContext.Provider>
}