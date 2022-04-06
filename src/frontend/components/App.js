import {BrowserRouter,} from "react-router-dom";
import MarketAbi from '../contractsData/Market.json'
import MarketAddress from '../contractsData/Market-address.json'
import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import {useState, useEffect} from 'react'
import {ethers} from "ethers"
import {Spinner} from 'react-bootstrap'
import {
    Link
} from "react-router-dom";
import {Navbar, Nav, Button, Container} from 'react-bootstrap'

import './App.css';

function App() {
    const [loading, setLoading] = useState(true)
    const [account, setAccount] = useState(null)
    const [nft, setNFT] = useState({})
    const [market, setMarket] = useState({})

    // MetaMask Login/Connect
    const web3Handler = async () => {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        setAccount(accounts[0]);

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();

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
        loadContracts(signer)
    }

    const loadContracts = async (signer) => {
        // Get deployed copies of contracts
        const market = new ethers.Contract(MarketAddress.address, MarketAbi.abi, signer)
        setMarket(market)
        const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
        setNFT(nft)
        setLoading(false)
    }

    useEffect(() => {
        web3Handler();
    }, [])

    return (
        <BrowserRouter>
            <div className="App">
                <>
                    <Navbar expand="lg" bg="secondary" variant="dark">
                        <Container>
                            <Navbar.Brand href="http://www.dappuniversity.com/bootcamp">
                                <img src={market} width="40" height="40" className="" alt=""/>
                                &nbsp; DApp NFT Marketplace
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav className="me-auto">
                                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                                    <Nav.Link as={Link} to="/create">Create</Nav.Link>
                                    <Nav.Link as={Link} to="/my-listed-items">My Listed Items</Nav.Link>
                                    <Nav.Link as={Link} to="/my-purchases">My Purchases</Nav.Link>
                                </Nav>
                                <Nav>
                                    {account ? (
                                        <Nav.Link
                                            href={`https://etherscan.io/address/${account}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="button nav-button btn-sm mx-4">
                                            <Button variant="outline-light">
                                                {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                            </Button>

                                        </Nav.Link>
                                    ) : (
                                        <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                                    )}
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
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
                        </div>
                    )}
                </div>
            </div>
        </BrowserRouter>

    );
}

export default App;