const { run } = require("hardhat");

async function main() {
  // Run security checks
  await run("check");
  
  // Run gas reporter
  await run("gas-reporter");
  
  // Run coverage
  await run("coverage");
  
  // Run slither analysis
  await run("slither");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });