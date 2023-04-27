import { CentrifugeProviderEmulator } from "../providers/centrifuge/emulator";
import { Web3Provider } from "../providers/web3"
import { AsksNBidsPage } from "./components/page/AsksNBids";



const App = () => {
  return (
    <Web3Provider>
      <CentrifugeProviderEmulator>
        <AsksNBidsPage />
      </CentrifugeProviderEmulator>
    </Web3Provider>
  )
}

export default App
