const { ethers } = require("hardhat")
const {expect}  = require("chai")

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(),'ether')
}

describe("Token",()=>{
    let token;
    let deployer;
    let accounts;
    let receiver;
    let name = "Dapp University";
    let symbol = "DAPP";
    let totalSupply = tokens("1000000")
    beforeEach(async () => {
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy(name,
                                    symbol,
                                    "1000000");

        accounts = await ethers.getSigners();
        deployer = accounts[0];
        receiver = accounts[1];
    })

    describe("deployment",()=>{
        it("has a name",async ()=>{
       
            const name = await token.name();
            expect(name).to.equal("Dapp University")
        })
    
        it("has correct symbol",async ()=>{
          
            const symbol = await token.symbol();
            expect(symbol).to.equal("DAPP")
        })
        it("has correct decimals",async ()=>{
          
            const decimals = await token.decimals();
            expect(decimals).to.equal("18")
        })
        it("has correct total supply",async ()=>{
            expect(await token.totalSupply()).to.equal(totalSupply)
        })
        it("assigns total supply to deployer",async ()=>{
            // 使用 balanceOf 调用获取 deployer 的余额
            const deployerBalance = await token.balanceOf(deployer.address);
            expect(deployerBalance).to.equal(totalSupply);
        })

    })

    describe("Sending Tokens",() => {
        let amount,transaction,result
        beforeEach(async () => {
            amount = tokens(100)
            transaction = await token.connect(deployer).transfer(receiver.address,amount);
            result = transaction.wait();
        })
        it("Transfers token balances",async () => {
            expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900));
            expect(await token.balanceOf(receiver.address)).to.equal(amount);

        })
    })
    
})