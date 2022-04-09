import {BrowserRouter,} from "react-router-dom";
import LandNFTAbi from '../contractsData/LandNFT.json'
import LandNFTAddress from '../contractsData/LandNFT-address.json'
import {useState, useEffect} from 'react'
import {ethers} from "ethers"
import {Spinner} from 'react-bootstrap'
import {
    Link
} from "react-router-dom";
import {Navbar, Nav, Button, Container} from 'react-bootstrap'

import './App.css';

let provider;
let signer;
let landNFT;

function App() {
    const [loading, setLoading] = useState(true)
    const [account, setAccount] = useState(null)
    const [ListNFT, setListNFT] = useState([])

    // MetaMask Login/Connect
    const web3Handler = async () => {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        setAccount(accounts[0]);

        provider = new ethers.providers.Web3Provider(window.ethereum)
        signer = provider.getSigner();

        console.log(await provider.getNetwork());

        window.ethereum.on('chainChanged', (chainId) => {
            console.log(chainId);
            window.location.reload();
        })

        window.ethereum.on('accountsChanged', async function (accounts) {
            console.log(accounts);
            setAccount(accounts[0])
            await web3Handler()
        })

        loadContracts();
    }

    const loadContracts = async () => {
        landNFT = new ethers.Contract(LandNFTAddress.address, LandNFTAbi.abi, signer);

        // setNFT(nft)
        const totalCount = await landNFT.totalSupply();
        console.log('totalCount', parseInt(totalCount));

        const userTotalCount = await landNFT.balanceOf(signer.getAddress());
        console.log('userTotalCount', parseInt(userTotalCount));

        const allLandMedia = await landNFT.getAllLandsMedia();
        console.log('allLandMedia', allLandMedia);

        const pageNFT = await landNFT.userLands(0, 12);
        console.log('pageNFT', pageNFT);

        // const firstNFT = await landNFT.userLandByIndex(0);
        // console.log('firstNFT', firstNFT);

        setLoading(false)
    }

    const handleMint = (deposit) => {
        // let res = await landNFT.safeMint({
        //     value: ethers.utils.parseEther(deposit)
        // });
        // console.log('res', res);
        landNFT.safeMint({
            value: ethers.utils.parseEther(deposit)
        }).then(result => {
            console.log(`Result`, result);
        }).catch(err => {
            console.log(`ERR:`, err);
        });
    }

    useEffect(() => {
        web3Handler();
    }, [])

    return (
        <BrowserRouter>
            <div className="App">
                <>
                    <div>
                        {account ? (
                            <Nav.Link className="button nav-button btn-sm mx-4">
                                {account.slice(0, 5) + '...' + account.slice(38, 42)}
                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant="outline-light">LogIn</Button>
                        )}
                    </div>
                </>
                <div>
                    {loading ? (
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh'}}>
                            <Spinner animation="border" style={{display: 'flex'}}/>
                            <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
                        </div>
                    ) : (
                        <div>
                            ...

                            <button onClick={() => handleMint("0.01")}>Mint Small</button>
                            <button onClick={() => handleMint("5")}>Mint Medium</button>
                            <button onClick={() => handleMint("9")}>Mint Large</button>
                        </div>
                    )}
                </div>
            </div>
        </BrowserRouter>

    );
}

export default App;