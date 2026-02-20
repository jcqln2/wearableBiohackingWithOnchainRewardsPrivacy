const hre = require("hardhat");

async function main() {
    console.log("Deploying VibeNFT to", hre.network.name, "...");

    const VibeNFT = await hre.ethers.getContractFactory("VibeNFT");
    const vibeNFT = await VibeNFT.deploy();
    await vibeNFT.waitForDeployment();

    const address = await vibeNFT.getAddress();
    console.log("VibeNFT deployed to:", address);
    console.log("\nAdd this to your .env and Netlify env vars:");
    console.log(`CONTRACT_ADDRESS=${address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
