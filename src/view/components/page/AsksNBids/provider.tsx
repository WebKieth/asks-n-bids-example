import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react"
import { SubscriptionEmulator, useCentrifugeEmulated } from "../../../../providers/centrifuge/emulator"
import { usePrevious } from "../../../../utils/usePrevious"
import { useKeygen } from "../../../../utils/useKeygen"

export type StatItem = {
  delta: 'asc' | 'desc' | null
  value: string
}
export type StatModel = Record<string, Array<StatItem>> | null

type TAsksNBidsContext = {
  asks: StatModel
  bids: StatModel
}
const AsksNBidsContext = createContext<TAsksNBidsContext>({
  asks: null,
  bids: null,
})

export const AsksAndBidsProvider = ({children}: {children: ReactNode}) => {
  const SUB_NAME = 'orderbook'
  const sub = useRef<SubscriptionEmulator | null>()
  const { addSubscription, removeSubscription } = useCentrifugeEmulated()
  const [source, setSource] = useState(null)
  const [asks, setAsks] = useState(null)
  const [bids, setBids] = useState(null)

  const prevSource = usePrevious(source)
  const generateKey = useKeygen()

  const getDelta = (key: string, value: string, rowIndex: number, cellIndex: number) => {
    if (!prevSource) return null
    const prevValue = prevSource[key][rowIndex][cellIndex]
    return Number(value) > Number(prevValue) ? 'asc' : 'desc'
  }

  const createModel = (key: 'asks' | 'bids') => {
    console.log(key, source)
    if (!source[key]) return null
    const model = {}
    source[key].forEach((sourceStatItem: string[], rowIndex: number) => {
      model[generateKey(rowIndex)] = sourceStatItem.map((item, cellIndex) => ({
        value: item,
        delta: getDelta('asks', item, rowIndex, cellIndex)
      }))
    })
    return model
  }

  const createAsksModel = () => {
    setAsks(createModel('asks'))
  }
  const createBidsModel = () => {
    setBids(createModel('bids'))
  }

  useEffect(() => {
    sub.current = addSubscription(SUB_NAME)
    sub.current.on('message', (data: any) => {
      setSource(data)
    })
  }, [])

  useEffect(() => {
    if (!source) return
    createAsksModel()
    createBidsModel()
    // NOTE: according docs - resubscribing if sequence was broken.
    if (prevSource && prevSource.sequence === (source.sequence + 1)) {
      
      sub.current = null
      removeSubscription(SUB_NAME)
      addSubscription(SUB_NAME)
    }
  }, [source])

  return <AsksNBidsContext.Provider value={{asks, bids}}>
    {children}
  </AsksNBidsContext.Provider>
}

export const useAsksNBidsProvided = () => useContext(AsksNBidsContext)

export const withAsksNBidsProvider = (Component: React.ComponentType) => ({...props}) => {
  return <AsksAndBidsProvider>
    <Component {...props}/>
  </AsksAndBidsProvider>
}