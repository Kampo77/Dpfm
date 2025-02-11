# FinancialManager Contract Deployment

Этот репозиторий содержит Solidity контракт [FinancialManager.sol](contracts/FinancialManager.sol), который управляет транзакциями, бюджетами и выводом комиссий.

## Требования

- Node.js и npm
- [Hardhat](https://hardhat.org/) для компиляции и развертывания
- Ethereum кошелёк (например, MetaMask) и тестовые ETH для выбранной тестовой сети

## Установка зависимостей

```bash
npm install
npm install @openzeppelin/contracts
```

## Компиляция контракта

```bash
npx hardhat compile
```

## Развертывание контракта

### Тестовая сеть

Используйте скрипт развертывания `scripts/deploy.js` для развертывания на тестовой сети (например, Goerli или Rinkeby).

```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

### Основная сеть

После успешной валидации на тестовой сети настройте параметры сети в файле `hardhat.config.js` и разверните контракт командой, аналогичной приведённой выше, с указанием основной сети.

## Дополнительная информация

- **Безопасность:** Контракт использует OpenZeppelin AccessControl, Ownable и ReentrancyGuard для защиты от несанкционированного доступа и повторных вызовов. SafeMath обеспечивает дополнительную защиту от переполнения, хотя в Solidity 0.8 проверки встроены.
- **Документация:** Контракт снабжён комментариями NatSpec (@dev, @notice, @param) для понятности кода.
- **Контакт:** Для вопросов обращайтесь в Issues данного репозитория.
