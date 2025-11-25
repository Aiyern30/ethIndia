import hre from "hardhat";

async function main() {
  // Deploy Marketplace
  const MarketplaceFactory = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await MarketplaceFactory.deploy();
  await marketplace.deployed();
  console.log("Marketplace deployed at:", marketplace.address);

  // Verify Marketplace
  await hre.run("verify:verify", {
    address: marketplace.address,
    constructorArguments: [],
  });

  // Deploy CollectionFactory
  const FactoryFactory = await hre.ethers.getContractFactory("CollectionFactory");
  const factory = await FactoryFactory.deploy();
  await factory.deployed();
  console.log("CollectionFactory deployed at:", factory.address);

  // Verify CollectionFactory
  await hre.run("verify:verify", {
    address: factory.address,
    constructorArguments: [],
  });
}

main().catch(console.error);
