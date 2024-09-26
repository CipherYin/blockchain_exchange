const { ethers } = require("hardhat");
const config = require("../src/config.json")
const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(),'ether')
}
const wait = (seconds) => {
    const milliseconds = seconds * 1000
    return new Promise(resolve => setTimeout(resolve,milliseconds))
}
async function main() {
    const accounts = await ethers.getSigners()
    const {chainId} = await ethers.provider.getNetwork()
    console.log("Using chainId:",chainId)
    //fetch deployed tokens
    const DApp = await ethers.getContractAt('Token',config[chainId].DApp.address)
    console.log(`Dapp Token fetched: ${DApp.address}`)

    const mETH = await ethers.getContractAt('Token',config[chainId].mETH.address)
    console.log(`mETH Token fetched: ${mETH.address}`)

    const mDAI = await ethers.getContractAt('Token',config[chainId].mDAI.address)
    console.log(`mDai Token fetched: ${mDAI.address}`)

   
    const exchange = await ethers.getContractAt('Exchange',config[chainId].exchange.address)
    console.log(`Exchange Token fetched: ${exchange.address}`)
    await wait(2)
    //give tokens to account[1]
    let sender = accounts[0]
    const receiver = accounts[1]
    let amount = tokens(10000)
    // user1 transfers 10,000 mETH
    let transaction,result
    
    const amountToTransfer = ethers.utils.parseUnits('1',18)
    transaction = await DApp.connect(receiver).approve(exchange.address,amountToTransfer)
    await transaction.wait()

    transaction = await exchange.connect(receiver).depositToken(DApp.address,amountToTransfer)
    await transaction.wait()

    // transaction = await mETH.connect(sender).transfer(receiver.address,amount)
    // console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`)
    // //set up users
    // const user1 = accounts[0]
    // const user2 = accounts[1]
    // amount = tokens(10000)
    // await wait(2)
    // //user1 approves 10,000 Dapp...
    // transaction = await DApp.connect(user1).approve(exchange.address,amount)
    // await transaction.wait()
    // console.log(`Approved ${amount} tokens from ${user1.address}`)
    // //user1 deposit 10,000 Dapp...
    // transaction = await exchange.connect(user1).depositToken(DApp.address,amount)
    // await transaction.wait()
    // console.log(`Deposited ${amount} DApp from ${user1.address}`)
    // await wait(2)
    // //user2 approves 10,000 mETH...
    // transaction = await mETH.connect(user2).approve(exchange.address,amount)
    // await transaction.wait()
    // console.log(`Approved ${amount} tokens from ${user2.address}`)
    // //user2 deposit 10,000 mETH...
    // transaction = await exchange.connect(user2).depositToken(mETH.address,amount)
    // await transaction.wait()
    // console.log(`Deposited ${amount} mETH from ${user2.address}`)
    // await wait(2)
    // //User 1 makes order to get tokens
    // let orderId;
    // transaction = await exchange.connect(user1).makeOrder(mETH.address,tokens(100),DApp.address,tokens(5))
    // result = await transaction.wait()
    // console.log(`Made order from ${user1.address}`)
    // await wait(2)
    // //User 1 cancels order
    // orderId = result.events[0].args.id;
    // transaction = await exchange.connect(user1).cancelOrder(orderId)
    // result = await transaction.wait()
    // console.log(`Cancelled order from ${user1.address}\n`)

    // await wait(1)
    // //Fill orders

    // //User 1 makes order
    // transaction = await exchange.connect(user1).makeOrder(mETH.address,tokens(100),DApp.address,tokens(10))
    // result = await transaction.wait()
    // console.log(`Made order from ${user1.address}`)

    // //User 2 fills order
    // orderId = result.events[0].args.id
    // transaction = await exchange.connect(user2).fillOrder(orderId)
    // result = await transaction.wait()
    // console.log(`Made order from ${user1.address}`)

    // await wait(1)

    // //User 1 makes order
    // transaction = await exchange.connect(user1).makeOrder(mETH.address,tokens(50),DApp.address,tokens(15))
    // result = await transaction.wait()
    // console.log(`Made order from ${user1.address}`)
    //  //User 2 fills order
    //  orderId = result.events[0].args.id
    //  transaction = await exchange.connect(user2).fillOrder(orderId)
    //  result = await transaction.wait()
    //  console.log(`Made order from ${user1.address}`)
    //  await wait(1)

    //  transaction = await exchange.connect(user1).makeOrder(mETH.address,tokens(200),DApp.address,tokens(20))
    //  result = await transaction.wait()
    //  console.log(`Made order from ${user1.address}`)

    //  orderId = result.events[0].args.id
    //  transaction = await exchange.connect(user2).fillOrder(orderId)
    //  result = await transaction.wait()
    //  console.log(`Made order from ${user1.address}`)
    //  await wait(1)

    //  //user1 makes 10 orders
    //  for(let i = 1;i <= 10;i++){
    //     transaction = await exchange.connect(user1).makeOrder(mETH.address,tokens(10 * i),DApp.address,tokens(10))
    //     result = await transaction.wait()

    //     console.log(`Made order from ${user1.address}`)
    //     await wait(1)
    //  }
     
    //  //user2 makes 10 orders
    //  for(let i = 1;i <= 10;i++){
    //     transaction = await exchange.connect(user2).makeOrder(DApp.address,tokens(10 ),mETH.address,tokens(10*i))
    //     result = await transaction.wait()
    //     console.log(`Made order from ${user2.address}`)
    //     await wait(1)
    //  }
}  


main()
    .then(()=>process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })