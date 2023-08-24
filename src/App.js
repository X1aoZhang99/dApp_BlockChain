import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'
import AddItem from './components/AddItem'

// ABIs
import Dappazon from './abis/Dappazon.json'

// Config
import config from './config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [dappazon, setDappazon] = useState(null)
  const [account, setAccount] = useState(null)
  const [electronics, setElectronics] = useState(null)
  const [clothing, setClothing] = useState(null)
  const [toys, setToys] = useState(null)
  const [item, setItem] = useState({})
  const [items, setItems] = useState([])
  const [toggle, setToggle] = useState(false)
  const [toggleAdd, setToggleAdd] = useState(false)

  const togglePopItem = (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
  }

  const togglePopAdd = () => {
    console.log('toggleAdd')
    toggleAdd ? setToggleAdd(false) : setToggleAdd(true)
  }


  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    console.log('Network:', network);

    const dappazon = new ethers.Contract(config[network.chainId].dappazon.address, Dappazon, provider)
    setDappazon(dappazon);
    console.log('Dappazon:', dappazon);

    const items = [];
    const totalItems = await dappazon.getItemCount();
    console.log('Total Items:', totalItems.toNumber());

    for (var i = 1; i <= totalItems; i++) {
      const item = await dappazon.items(i)
      items.push(item)
    }
    console.log('Items:', items);
    setItems(items);
    const electronics = items.filter((item) => item.category === 'electronics');
    const clothing = items.filter((item) => item.category === 'clothing');
    const toys = items.filter((item) => item.category === 'toys');

    setElectronics(electronics);
    setClothing(clothing);
    setToys(toys);

  }

  useEffect(() => {
    loadBlockchainData();
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2>Dappazon Best Seller</h2>
      <div className='button_container'><button type='button' className='add_item_button' onClick={() => togglePopAdd()}>Add Item</button></div>
      {electronics && clothing && toys && (
        <>
          <Section title={"Clothing & Jewelry"} items={clothing} togglePopItem={togglePopItem} />
          <Section title={"Electronics & Gadgets"} items={electronics} togglePopItem={togglePopItem} />
          <Section title={"Toys & Gaming"} items={toys} togglePopItem={togglePopItem} />
        </>
      )}

      {toggle && (
        <Product item={item} provider={provider} account={account} dappazon={dappazon} togglePopItem={togglePopItem} />
      )}

      {toggleAdd && (
        <AddItem dappazon={dappazon} 
        togglePopAdd={togglePopAdd} 
        setElectronics={setElectronics} 
        setClothing={setClothing} 
        setToys={setToys} 
        provider={provider}/>
      )}

    </div>
  );
}

export default App;
