import hre from "hardhat";

async function main() {
  const Marketplace = await hre.ethers.deployContract("Marketplace");
  await Marketplace.waitForDeployment();
  console.log("Marketplace deployed at:", Marketplace.target);

  // Verify Marketplace
  await hre.run("verify:verify", {
    address: Marketplace.target,
    constructorArguments: [],
  });

  const Factory = await hre.ethers.deployContract("CollectionFactory");
  await Factory.waitForDeployment();
  console.log("CollectionFactory deployed at:", Factory.target);

  // Verify CollectionFactory
  await hre.run("verify:verify", {
    address: Factory.target,
    constructorArguments: [],
  });
}

main().catch(console.error);
