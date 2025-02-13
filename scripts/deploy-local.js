const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const FinancialManager = await hre.ethers.getContractFactory("FinancialManager");
  const manager = await FinancialManager.deploy();
  await manager.deployed();

  console.log("FinancialManager deployed to:", manager.address);
  
  // Save the contract address to a file
  const fs = require("fs");
  const contractData = {
    address: manager.address,
    abi: JSON.parse(manager.interface.format('json'))
  };

  // Create directories if they don't exist
  const dir = './dpfm-frontend/src/contracts';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(
    './dpfm-frontend/src/contracts/contract-config.json',
    JSON.stringify(contractData, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });