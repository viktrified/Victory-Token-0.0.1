const hre = require("hardhat");

async function main() {
    const VictoryToken = await hre.ethers.getContractFactory("VictoryToken")
    const victoryToken = await VictoryToken.deploy(100000000, 50);

    await victoryToken.waitForDeployment();

    console.log("Victory Token deployed: ", victoryToken.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});



