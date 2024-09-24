const { ethers } = require("hardhat");

async function main() {
    const Token = await ethers.getContractFactory("Token")
    const Exchange = await ethers.getContractFactory("Exchange")

    const accounts = await ethers.getSigners();

    //Deloy contract
    const dapp = await Token.deploy("Dapp University",'DAPP','1000000');
    await dapp.deployed();
    console.log(`DAPP deployed to: ${dapp.address}`)

    const mETH = await Token.deploy('mETH','mETH','1000000');
    await mETH.deployed();
    console.log(`mETH deployed to: ${mETH.address}`)

    const mDAI = await Token.deploy('mDAI','mDAI','1000000');
    await mDAI.deployed();
    console.log(`mDAI deployed to: ${mDAI.address}`);

    const exchange = await Exchange.deploy(accounts[1].address,10);
    await exchange.deployed();
    console.log(`Exchange deployed to: ${exchange.address}`)

    // npx hardhat run --network localhost scripts/1_deploy.js
//     DAPP deployed to: 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
// mETH deployed to: 0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6
// mDAI deployed to: 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
// Exchange deployed to: 0x610178dA211FEF7D417bC0e6FeD39F05609AD788
}

main()
    .then(()=>process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })