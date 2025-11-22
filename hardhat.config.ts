import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "^0.8.0",
  networks: {
    hardhat: {},
    // Add testnet/mainnet config here if needed
  },
};

export default config;
