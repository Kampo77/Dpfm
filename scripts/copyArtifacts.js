const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'artifacts', 'contracts');
const targetDir = path.join(__dirname, '..', 'dpfm-frontend', 'src', 'contracts');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Copy FinancialManager.json
const sourcePath = path.join(sourceDir, 'FinancialManager.sol', 'FinancialManager.json');
const targetPath = path.join(targetDir, 'FinancialManager.sol', 'FinancialManager.json');

// Create target subdirectories
fs.mkdirSync(path.dirname(targetPath), { recursive: true });

// Copy the file
fs.copyFileSync(sourcePath, targetPath);

console.log('Artifacts copied successfully!');