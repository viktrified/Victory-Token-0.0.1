const hre = require("hardhat");

async function main() {
    const Faucet = await hre.ethers.getContractFactory("Faucet")
    const faucet = await Faucet.deploy("0xDCf6A5DDC8F4eDf6796aBBFafa9FF84CE32CaF52");

    await faucet.waitForDeployment();

    console.log("Faucet contract deployed: ", faucet.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});



