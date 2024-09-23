const { ethers } = require("hardhat")
const {expect}  = require("chai")

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(),'ether')
}

describe("Token",()=>{
    let token,deployer,accounts,receiver,exchange;
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
        exchange = accounts[2];
    })

    describe("Deployment",()=>{
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
        let amount,transaction,result;

        describe("Success",()=>{
            beforeEach(async () => {
                amount = tokens(100)
                transaction = await token.connect(deployer).transfer(receiver.address,amount);
                result = await transaction.wait();
            })
            it("transfers token balances",async () => {
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900));
                expect(await token.balanceOf(receiver.address)).to.equal(amount);
    
            })
    
            it("emits a Transfer event",async () => {
                const event = result.events[0]
                // console.log(event)
                expect(event.event).to.equal("Transfer")
                const args = event.args;
                expect(args._from).to.equal(deployer.address);
                expect(args._to).to.equal(receiver.address);
                expect(args._value).equal(amount)
            })
        })
        
        describe("Failure",()=>{
            it("rejects insufficient balances",async () => {
                //Transfer more tokens than deployer has -10M
            
                const invalidAmount = tokens(100000000)
                await expect(token.connect(deployer).transfer(receiver.address,invalidAmount)).to.be.reverted
            })
            it("rejects invalid recipent",async () => {
                //Transfer more tokens than deployer has -10M
            
                const invalidAmount = tokens(100)                                                           
                await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000',invalidAmount)).to.be.reverted
            })
            
        })
    })

    describe("Approving Tokens",() => {
        let amount,transaction,result;
        beforeEach(async () => {
            amount = tokens(100)
            transaction = await token.connect(deployer).approve(exchange.address,amount);
            result = await transaction.wait();
        })
        describe("Success",()=>{
            it("allocates an allowance for delegated token spending",async () => {
                expect(await token.allowance(deployer.address,exchange.address)).to.equal(amount) 
            })
            it("emits a Approval event",async () => {
                const event = result.events[0]
                expect(event.event).to.equal("Approval")
                const args = event.args;
                expect(args._owner).to.equal(deployer.address);
                expect(args._spender).to.equal(exchange.address);
                expect(args._value).equal(amount)
            })
        })

        describe("Failure",()=>{
             it("rejects invalid spenders",async ()=>{
                await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000',amount)).to.be.reverted
             })
        })
    })
    

    describe("Delegated Token Transfers",() => {
        let amount,transaction,result;
        beforeEach(async () => {
            amount = tokens(100)
            transaction = await token.connect(deployer).approve(exchange.address,amount);
            result = await transaction.wait();
        })
        describe("Success",() => {
            beforeEach(async () => {
                transaction = await token.connect(exchange).transferFrom(deployer.address,receiver.address,amount);
                result = await transaction.wait();
            })
            it("Transfers token balances",async () => {
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900));
                expect(await token.balanceOf(receiver.address)).to.equal(amount);
       
            })

            it('reset the allowance',async () => {
                expect(await token.allowance(deployer.address,exchange.address)).to.be.equal(0)
            })
            it("emits a Transfer event",async () => {
                const event = result.events[0]
                // console.log(event)
                expect(event.event).to.equal("Transfer")
                const args = event.args;
                expect(args._from).to.equal(deployer.address);
                expect(args._to).to.equal(receiver.address);
                expect(args._value).equal(amount)
            })
        })

        describe("Failure",async () => {
            it("rejects insufficient balances",async () => {
                //Transfer more tokens than deployer has -10M
            
                const invalidAmount = tokens(100000000)
                await expect(token.connect(exchange).transferFrom(deployer.address,receiver.address,invalidAmount)).to.be.reverted
            })
            it("rejects invalid recipent",async () => {
                //Transfer more tokens than deployer has -10M
            
                const invalidAmount = tokens(100)                                                           
                await expect(token.connect(deployer).transferFrom(deployer.address,'0x0000000000000000000000000000000000000000',invalidAmount)).to.be.reverted
            })
        })
    })
})