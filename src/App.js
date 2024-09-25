import logo from './logo.svg';
import { useEffect } from 'react';
import {ethers} from "ethers";
import config from "./config.json"
import { useDispatch } from 'react-redux';
import { loadProvider,loadNetwork,loadAccount,loadTokens,loadExchange } from './store/interactions';
import Navbar from './components/Navbar';
import Markets from './components/Markets';
function App() {
  const dispatch = useDispatch()

  const loadBlockchainData = async ()=>{
    const provider = loadProvider(dispatch)
    // current account && balance from Metamask

    window.ethereum.on('accountsChanged',async () => {
      await loadAccount(dispatch,provider)
    })
    // await loadAccount(dispatch,provider)
    //hardhat: 31337 kovan:42
    const chainId = await loadNetwork(provider,dispatch)

    //Reload page when network changes
    window.ethereum.on('chainChanged',()=>{
      window.location.reload()
    })
    await loadTokens(provider,[config[chainId].DApp.address,config[chainId].mETH.address],dispatch)
    
    //Load exchange contract
    await loadExchange(provider,config[chainId].exchange.address,dispatch)
  }
  useEffect(()=>{
    loadBlockchainData()
  })

  return (
    <div>

      <Navbar/>

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          <Markets/>

          {/* Balance */}

          {/* Order */}

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;