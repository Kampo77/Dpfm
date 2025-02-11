const hre = require("hardhat");

async function main() {
  // Получаем фабрику контракта FinancialManager.
  const FinancialManager = await hre.ethers.getContractFactory("FinancialManager");
  console.log("Deploying FinancialManager...");

  // Разворачиваем контракт.
  const financialManager = await FinancialManager.deploy();
  await financialManager.deployed();
  console.log("FinancialManager deployed to:", financialManager.address);

  // Автоматическая верификация контракта, если сеть не локальная.
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await financialManager.deployTransaction.wait(5); // ждём 5 подтверждений

    try {
      console.log("Verifying contract...");
      await hre.run("verify:verify", {
        address: financialManager.address,
        constructorArguments: [],
      });
      console.log("Contract verified successfully.");
    } catch (error) {
      console.error("Verification failed:", error);
    }
  }
}

// Запускаем основной скрипт и обрабатываем возможные ошибки.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });