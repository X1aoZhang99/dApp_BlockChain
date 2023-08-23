import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

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
  const [toggle, setToggle] = useState(false)

  const togglePop = (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
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
    const electronics = items.filter((item) => item.category === 'electronics');
    const clothing = items.filter((item) => item.category === 'clothing');
    const toys = items.filter((item) => item.category === 'toys');

    setElectronics(electronics);
    setClothing(clothing);
    setToys(toys);

  }

  const addItemHandler = async() => {
    let bigNumber = await dappazon.getItemCount()
    let _id = bigNumber.toNumber() + 1;
    const item = {
      "id": _id,
      "name": "Laptop",
      "category": "electronics",
      "image": "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/camera.jpg",
      "price": "1.25",
      "rating": 5,
      "stock": 5
    }
    console.log(item)
    try {
      const transaction = await dappazon.connect(provider.getSigner()).list(
        item.id,
        item.name,
        item.category,
        item.image,
        ethers.utils.parseUnits(item.price.toString(), 'ether'),
        item.rating,
        item.stock
      )
      await transaction.wait()
    } catch (error) {
      console.log(error)
    }
    
  }

  useEffect(() => {
    loadBlockchainData();
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2>Dappazon Best Seller</h2>
      <div className='button_container'><button type='button' className='add_item_button' onClick={addItemHandler}>Add Item</button></div>
      {electronics && clothing && toys && (
        <>
          <Section title={"Clothing & Jewelry"} items={clothing} togglePop={togglePop} />
          <Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop} />
          <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
        </>
      )}

      {toggle && (
        <Product item={item} provider={provider} account={account} dappazon={dappazon} togglePop={togglePop} />
      )}
    </div>
  );
}

export default App;
