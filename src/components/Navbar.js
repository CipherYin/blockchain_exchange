
import { useSelector,useDispatch } from "react-redux";
import logo from "../assets/logo.png"
import Blockies from 'react-blockies'
import { loadAccount } from "../store/interactions";
import eth from "../assets/eth.svg"
import config from "../config.json"
const Navbar = ()=>{
    const account = useSelector(state => state.provider.account)
    const balance = useSelector(state => state.provider.balance)
    const provider = useSelector(state => state.provider.connection)
    const chainId = useSelector(state => state.provider.chainId)
    const dispatch = useDispatch()

    const connectHandler = async ()=>{
        //Load account...
        await loadAccount(dispatch,provider)
    }
    const networkHandler = async (e) => {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: e.target.value}]
        })
    }
    return(
        <div className='exchange__header grid'>
            <div className='exchange__header--brand flex'>
                <img src={logo} className="logo" alt="DApp Logo"></img>
                <div>DApp Token Exchange</div>
            </div>
    
            <div className='exchange__header--networks flex'>
                <img src={eth} alt="ETH Logo" className="Eth Logo"/>
                {chainId&& (
                    <select name="networks" id="networks" value={config[chainId]?`0x${chainId.toString(16)}`:`0`} onChange={networkHandler}>
                        <option value="0">Select Network</option>
                        <option value="0x7a69">Localhost</option>
                        <option value="0xaa9b79">Sepolia</option>
                    </select>
                )}
                
            </div>
    
            <div className='exchange__header--account flex'>
                {balance? (
                    <p><small>My Balance</small>{Number(balance).toFixed(4)}</p>
                ): (
                    <p><small>My Balance</small>0 ETH</p>
                )}
                {account?(
                        <a 
                            href={`https://etherscan.io/address/${account}`}
                            target="_blank"
                            rel="norefferrer">
                            {account.slice(0,5)+'...'+account.slice(38,42)}
                            <Blockies
                                size={10}
                                scale={3}
                                color='#2187D0'
                                bgColor='#F1F2F9'
                                spotColor='#767F92'
                                seed={account}
                                className='identicon'
                            />
                        </a>
                       
                ):(
                    <button className="button" onClick={connectHandler}>Connect</button>
                )}
            </div>
      </div>
    )
}

export default Navbar;