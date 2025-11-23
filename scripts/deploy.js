import hre from "hardhat";

async function main() {
  const Marketplace = await hre.ethers.deployContract("Marketplace");
  await Marketplace.waitForDeployment();
  console.log("Marketplace deployed at:", Marketplace.target);

  const Factory = await hre.ethers.deployContract("CollectionFactory");
  await Factory.waitForDeployment();
  console.log("CollectionFactory deployed at:", Factory.target);
}

main().catch(console.error);
