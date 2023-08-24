// Contract: Dappazon.sol
const { ethers } = require('hardhat');
const { expect } = require('chai');
const { wait } = require('@testing-library/user-event/dist/utils');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ID = 1;
const NAME = "Shoes";
const CATEGORY = "Clothing";
const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg";
const COST = tokens(1);
const RATING = 4;
const STOCK = 5;


describe("Dappazon", () => {
  let dappazon
  let deployer, lister, buyer

  beforeEach(async () => {
    // Setup accounts
    [deployer, lister, buyer] = await ethers.getSigners()

    // Deploy contract
    const Dappazon = await ethers.getContractFactory("Dappazon")
    dappazon = await Dappazon.deploy()
  })

  describe("Deployment", () => {
    it("Sets the owner", async () => {
      expect(await dappazon.owner()).to.equal(deployer.address)
    })
  })

  describe("Listing", () => {
    let transaction;
    
    beforeEach(async () => {
      transaction = await dappazon.connect(lister).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transaction.wait()
    })
    it("Returns item attributes", async () => {
      const item = await dappazon.items(1);
      
      expect(item.id).to.equal(ID)
      expect(item.owner).to.equal(lister.address)
      expect(item.name).to.equal(NAME)
      expect(item.category).to.equal(CATEGORY)
      expect(item.image).to.equal(IMAGE)
      expect(item.cost).to.equal(COST)
      expect(item.rating).to.equal(RATING)
      expect(item.stock).to.equal(STOCK)
    })
    it("Emits a List event", async () => {
      expect(transaction).to.emit(dappazon, 'List');
    })

  })

  describe("Buying", () => {
    let transaction;

    beforeEach(async () => {
      // List an item
      transaction = await dappazon.connect(lister).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();

      // Buy an item
      transaction = await dappazon.connect(buyer).buy(ID, { value: COST });
      
    });

    it("Updates buyer's order count", async () => {
      const result = await dappazon.orderCount(buyer.address)
      expect(result).to.equal(1)
    });

    it("Adds the order", async () => {
      const order = await dappazon.orders(buyer.address, 1)

      expect(order.time).to.be.greaterThan(0)
      expect(order.item.name).to.equal(NAME)
    });

    it("Updates the contract balance", async () => {
      const initialBalance = await ethers.provider.getBalance(lister.address);

      // List an item
      const listTx = await dappazon.connect(lister).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      const listReceipt = await listTx.wait();
      const listGasUsed = listReceipt.gasUsed.mul(listReceipt.effectiveGasPrice);

      // Buy an item
      await dappazon.connect(buyer).buy(ID, { value: COST });

      const finalBalance = await ethers.provider.getBalance(lister.address);
      const expectedBalance = initialBalance.add(COST).sub(listGasUsed);

      expect(finalBalance).to.equal(expectedBalance);
    });

    it("Emits a Buy event", async () => {
      expect(transaction).to.emit(dappazon, 'Buy');
    });
    
  })
})
