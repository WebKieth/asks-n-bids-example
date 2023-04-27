import { CentrifugeProviderEmulator } from "../providers/centrifuge/emulator";
import { AsksNBidsPage } from "./components/page/AsksNBids";
import { Web3Provider } from "../providers/web3/provider";
import { CentrifugeProvider } from "../providers/centrifuge/provider";



const App = () => {
  return (
    <Web3Provider>
      <CentrifugeProviderEmulator>
        <CentrifugeProvider>
          <AsksNBidsPage />
        </CentrifugeProvider>
      </CentrifugeProviderEmulator>
    </Web3Provider>
  )
}

export default App
