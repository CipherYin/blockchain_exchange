const { ethers } = require("hardhat")
const {expect}  = require("chai")

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(),'ether')
}

describe("Exchange",()=>{
    let deployer,feeAccount,exchange,token1,user1,user2;
    const feePercent = 10;
    let name = "Dapp University";
    let symbol = "DAPP";
    beforeEach(async () => {
        const Exchange = await ethers.getContractFactory("Exchange");

        const Token = await ethers.getContractFactory("Token");
        token1 = await Token.deploy(name,symbol,"1000000")

        accounts = await ethers.getSigners();
        deployer = accounts[0];
        feeAccount = accounts[1];
        user1 = accounts[2];
        user2 = accounts[3];
        let transaction = await token1.connect(deployer).transfer(user1.address,tokens(100))
        exchange = await Exchange.deploy(feeAccount.address,feePercent);   
    })

    describe("Deployment",() => {
        it("tracks the fee account",async () => {
            expect(await exchange.feeAccount()).to.equal(feeAccount.address);
        })
        it("tracks the fee percent",async () => {
            expect(await exchange.feePercent()).to.equal(feePercent);
        })
    })

    describe("Depositing Token",()=>{     
        describe("Success",()=>{
            let transaction,result;
            amount = tokens(10)

            beforeEach(async () => {
                //Approve Token
                transaction = await token1.connect(user1).approve(exchange.address,amount);
                result = await transaction.wait()
                //Deposit Token
                transaction = await exchange.connect(user1).depositToken(token1.address,amount);
                result = await transaction.wait()
            })
            it("tracks the token deposit",async () => {

                expect(await token1.balanceOf(exchange.address)).to.equal(amount)
                expect(await exchange.tokens(token1.address,user1.address)).to.equal(amount)
                expect(await exchange.balanceOf(token1.address,user1.address)).to.equal(amount)
                it("emits a Transfer event",async () => {
                    const event = result.events[0]
                    // console.log(event)
                    expect(event.event).to.equal("Deposit")
                    const args = event.args;
                    expect(args.token).to.equal(token1.address);
                    expect(args.user).to.equal(user1.address);
                    expect(args._value).equal(amount);
                    expect(args.balance).equal(amount);

                })
            })
        })

        describe("Failure",() => {
            it("fails when no tokens are approved",async () => {
                await expect(exchange.connect(user1).depositToken(token1.address,amount)).to.be.reverted
            })
        })
    })

    describe("Withdrawing Token",()=>{
        let transaction,result;
        amount = tokens(10);
        describe("Success",()=>{
           beforeEach(async () => {
             // deposit tokens before withdrawing

             //Approve Token
             transaction = await token1.connect(user1).approve(exchange.address,amount);
             result = await transaction.wait()
             //Deposit Token
             transaction = await exchange.connect(user1).depositToken(token1.address,amount);
             result = await transaction.wait()

             //Now withdraw Tokens
             transaction = await exchange.connect(user1).withdrawToken(token1.address,amount);
             result = await transaction.wait();
           })

           it('withdraws token funds',async () => {
             expect(await token1.balanceOf(exchange.address)).to.equal(0)
             expect(await exchange.tokens(token1.address,user1.address)).to.equal(0)
             expect(await exchange.balanceOf(token1.address,user1.address)).to.equal(0)

           })
           it("emits a Transfer event",async () => {
            const event = result.events[1]
            // console.log(event)
            expect(event.event).to.equal("Withdraw")
            const args = event.args;
            expect(args.token).to.equal(token1.address);
            expect(args.user).to.equal(user1.address);
            expect(args._value).equal(amount);
            expect(args.balance).equal(0);

            })
        })

        describe("Failure",() => {
            it("fails for insufficient balances",async () => {
                let invalidAmount = tokens(1000)
                await expect(exchange.connect(user1).withdrawToken(token1.address,invalidAmount)).to.be.reverted
            })
        })
    })
})