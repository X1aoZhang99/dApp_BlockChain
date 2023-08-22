// import { ethers } from "hardhat"; 
// const hardhat = require('hardhat');
// const ethers = hardhat.ethers;
// import { expect } from "chai"
const { ethers } = require('hardhat');
const { expect } = require('chai');
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}


describe("Dappazon", () => {
  var dappazon;
  var delopyer,buyer, seller;
  beforeEach(async () => {
    [delopyer, buyer, seller] = await ethers.getSigners();
    //Deploy contract
    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();
    // await dappazon.deployed();
  })
  describe("Deployment", () => {
    it("Set owner", async () => {
      expect(await dappazon.owner()).to.equal(delopyer.address);
    })
  })

  describe("Listing", () => {
    let transaction;
    beforeEach(async () => {
    transaction = await dappazon.connect(delopyer).list(
      1,
      "Shoes", 
      "Clothing",
      "IMAGE",
      1,
      4,
      5
    )
     await transaction.wait();
    })
    it("Returns item attributes", async () => {
      const item = await dappazon.items(1);
      expect(item.id).to.equal(1);
    })
    it("Emits a List event", async () => {
      expect(transaction).to.emit(dappazon, 'List');
    })

  })
})
