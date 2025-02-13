import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
pragma solidity ^0.8.0;

contract FinancialManager is Ownable, AccessControl, ReentrancyGuard {
    using SafeMath for uint256;

    uint256 private constant MAX_INT = 2**256 - 1;
    mapping(address => uint256) private lastActionTime;
    uint256 private constant COOLDOWN_PERIOD = 1 minutes;

    modifier withCooldown() {
        require(
            block.timestamp >= lastActionTime[msg.sender] + COOLDOWN_PERIOD,
            "Please wait before next action"
        );
        _;
        lastActionTime[msg.sender] = block.timestamp;
    }

    function addTransaction(uint256 amount) external nonReentrant withCooldown {
        require(amount > 0 && amount < MAX_INT, "Invalid amount");
        // ... existing implementation
    }

    /// @notice Структура для хранения деталей транзакции.
    struct Transaction {
        uint256 id;
        uint256 amount;
        string category;
        string description;
        bool isExpense; // true - расход, false - доход.
    }

    /// @notice Структура для пользовательских бюджетов.
    struct Budget {
        uint256 limit;
        string category;
    }

    // События для уведомлений.
    event TransactionAdded(address indexed user, uint256 transactionId, uint256 amount, string category, bool isExpense);
    event PaidTransactionAdded(address indexed user, uint256 transactionId, uint256 amount, string category, bool isExpense, uint256 fee);
    event BudgetUpdated(address indexed user, uint256 limit, string category);
    event FeesWithdrawn(address indexed owner, uint256 amount);
    event AuthorizedUserAdded(address indexed account);
    event AuthorizedUserRemoved(address indexed account);

    /// @notice Внутренний счётчик транзакций.
    uint256 private transactionCounter;
    /// @notice Суммарный баланс собранных комиссий.
    uint256 public feesBalance;

    /// @notice Отображение транзакций пользователя.
    mapping(address => Transaction[]) private userTransactions;
    /// @notice Отображение бюджетов пользователей.
    mapping(address => Budget) private budgets;

    /**
     * @notice Конструктор контракта.
     * @dev Устанавливает адрес развёртывателя как владельца и авторизует его.
     */
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(AUTHORIZED_ROLE, msg.sender);
    }

    /**
     * @notice Разрешает добавление нового авторизованного пользователя.
     * @param account Адрес для предоставления доступа.
     */
    function addAuthorizedUser(address account) external onlyOwner {
        grantRole(AUTHORIZED_ROLE, account);
        emit AuthorizedUserAdded(account);
    }

    /**
     * @notice Отключает авторизацию указанного пользователя.
     * @param account Адрес для отзыва прав доступа.
     */
    function removeAuthorizedUser(address account) external onlyOwner {
        revokeRole(AUTHORIZED_ROLE, account);
        emit AuthorizedUserRemoved(account);
    }

    /**
     * @notice Добавляет новую транзакцию.
     * @param amount Сумма транзакции (должна быть положительной).
     * @param category Категория транзакции.
     * @param description Описание транзакции.
     * @param isExpense true, если транзакция является расходом.
     *
     * @dev Требования:
     * - Вызывающий должен иметь роль AUTHORIZED_ROLE.
     * - Сумма должна быть больше нуля.
     * - Если установлен бюджет для категории, сумма не может превышать лимит.
     */
    function addTransaction(
        uint256 amount,
        string calldata category,
        string calldata description,
        bool isExpense
    ) public onlyRole(AUTHORIZED_ROLE) {
        require(amount > 0, "Invalid input: Amount must be positive");

        // Проверка бюджета: если бюджет установлен и категория совпадает, сумма должна быть в пределах лимита.
        Budget memory userBudget = budgets[msg.sender];
        if (bytes(userBudget.category).length != 0 && compareStrings(userBudget.category, category)) {
            require(amount <= userBudget.limit, "Budget limit exceeded");
        }

        transactionCounter = transactionCounter.add(1);
        Transaction memory newTx = Transaction(transactionCounter, amount, category, description, isExpense);
        userTransactions[msg.sender].push(newTx);

        emit TransactionAdded(msg.sender, transactionCounter, amount, category, isExpense);
    }

    /**
     * @notice Добавляет транзакцию с оплатой комиссии.
     * @param amount Сумма транзакции.
     * @param category Категория транзакции.
     * @param description Описание транзакции.
     * @param isExpense true, если транзакция является расходом.
     *
     * @dev Требование: комиссия не менее 0.01 ether.
     */
    function addPaidTransaction(
        uint256 amount,
        string calldata category,
        string calldata description,
        bool isExpense
    )
        external
        payable
        onlyRole(AUTHORIZED_ROLE)
    {
        require(msg.value >= 0.01 ether, "Insufficient fee for paid transaction");
        feesBalance = feesBalance.add(msg.value);
        addTransaction(amount, category, description, isExpense);
        emit PaidTransactionAdded(msg.sender, transactionCounter, amount, category, isExpense, msg.value);
    }

    /**
     * @notice Устанавливает бюджет для пользователя по определённой категории.
     * @param limit Лимит бюджета (должен быть положительным).
     * @param category Категория, для которой устанавливается бюджет.
     */
    function setBudget(uint256 limit, string calldata category) external onlyRole(AUTHORIZED_ROLE) {
        require(limit > 0, "Invalid input: Budget must be positive");
        budgets[msg.sender] = Budget(limit, category);

        emit BudgetUpdated(msg.sender, limit, category);
    }

    /**
     * @notice Возвращает лимит бюджета для вызывающего.
     * @return Лимит бюджета.
     */
    function getBudgetLimit() external view returns (uint256) {
        return budgets[msg.sender].limit;
    }

    /**
     * @notice Возвращает все транзакции, сделанные вызывающим.
     * @return Массив структур Transaction.
     */
    function getUserTransactions() external view returns (Transaction[] memory) {
        return userTransactions[msg.sender];
    }

    /**
     * @notice Позволяет владельцу вывести собранные комиссии.
     * @dev Использует nonReentrant для защиты от reentrancy атак.
     */
    function withdrawFees() external onlyOwner nonReentrant {
        require(feesBalance > 0, "No fees to withdraw");
        uint256 amount = feesBalance;
        feesBalance = 0;
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Fee withdrawal failed");
        emit FeesWithdrawn(owner(), amount);
    }

    /**
     * @dev Сравнивает две строки на равенство.
     * @param a Первая строка.
     * @param b Вторая строка.
     * @return True, если строки идентичны.
     */
    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(bytes(a)) == keccak256(bytes(b)));
    }

    /// @notice Функция для принятия эфира.
    receive() external payable {
        feesBalance = feesBalance.add(msg.value);
    }

    /// @notice Фолбэк функция для принятия эфира.
    fallback() external payable {
        feesBalance = feesBalance.add(msg.value);
    }
}