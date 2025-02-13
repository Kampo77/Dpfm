const hre = require("hardhat");

async function main() {
  console.log("Deploying FinancialManager with minimal gas settings...");
  
  const FinancialManager = await hre.ethers.getContractFactory("FinancialManager");
  const financialManager = await FinancialManager.deploy({
    gasLimit: 1500000,
    maxFeePerGas: 100000000,      // 0.1 gwei
    maxPriorityFeePerGas: 100000000
  });
  
  // Wait for deployment transaction to be mined
  await financialManager.waitForDeployment();
  console.log("FinancialManager deployed to:", await financialManager.getAddress());

  // Wait for only 1 confirmation to save costs
  console.log("Waiting for 1 block confirmation...");
  const deployTx = financialManager.deploymentTransaction();
  await deployTx.wait(1);
  
  console.log("Verifying contract...");
  try {
    await hre.run("verify:verify", {
      address: await financialManager.getAddress(),
      constructorArguments: [],
    });
  } catch (error) {
    console.log("Verification failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });