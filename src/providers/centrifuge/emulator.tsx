import { ReactNode, createContext, useContext } from "react"

type TCentrifugeContext = {
  addSubscription: (name: string) => any,
  removeSubscription: (name: string) => void,
}
export class SubscriptionEmulator {
  polling: ReturnType<typeof setInterval> | null
  sequence: number
  name: string
  events: Map<string, (data: any) => void>
  constructor(name: string, delays = 3000) {
    this.events = new Map()
    this.name = name
    this.sequence = 0
    this.polling = setInterval(() => {
      if (this.events.has('message') === false) return
      const handleMessage = this.events.get('message')
      this.sequence = this.sequence + 1
      handleMessage(this._createMockData())
    }, delays)
  }
  _createMockData() {
    const createRandomModel = () => {
      const arr = [];
      for (let i = 0; i < 10; i++) {
        const stat = [`${(Math.random() * 100).toFixed(2)}`, `${(Math.random() * 100).toFixed(2)}`]
        arr.push(stat)
      }
      return arr
    }
    return {
      asks: createRandomModel(),
      bids: createRandomModel(),
      market_id: 'USD-ETH',
      timestamp: new Date().getTime(),
      sequence: this.sequence,
    }
  }
  on(eventName: string, callback: (data: any) => void) {
    this.events.set(eventName, callback)
  }
  removeAllListeners() {
    this.events = new Map()
  }
}

class CentrifugeEmulator {
  subscriptions: Map<string, SubscriptionEmulator>
  constructor() {
    this.subscriptions = new Map()
  }
  subscribe(name: string) {
    const subscription = new SubscriptionEmulator(name)
    if (this.subscriptions.has(name)) return
    this.subscriptions.set(name, subscription)
    return this.subscriptions.get(name)
  }
  unsubscribe(name: string) {
    const sub = this.subscriptions[name]
    if (sub === undefined) return
    sub.removeAllListeners()
    delete this.subscriptions[name]
  }
}

const EmulatorContext = createContext<TCentrifugeContext | null>(null)


export const CentrifugeProviderEmulator = ({children}: {children: ReactNode}) => {
  const emulator = new CentrifugeEmulator()
  const addSubscription = (name: string) => {
    return emulator.subscribe(name)
  }
  const removeSubscription = (name: string) => {
    emulator.unsubscribe(name)
  }
  return <EmulatorContext.Provider value={{ addSubscription, removeSubscription }}>
    {children}
  </EmulatorContext.Provider>
}

export const useCentrifugeEmulated = () => useContext(EmulatorContext)