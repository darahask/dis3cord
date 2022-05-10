const hre = require("hardhat");

async function main() {
    const Dis3cord = await hre.ethers.getContractFactory("Dis3cord");
    const dis3cord = await Dis3cord.deploy();
    await dis3cord.deployed();
    console.log("Dis3cord deployed to:", dis3cord.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
