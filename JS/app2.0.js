// Application state management
const appState = {
    currentUser: null,
    transactions: [],
    isAuthenticated: false,
    users: {}
};

// DOM element references
const elements = {
    // Navigation
    navbar: document.getElementById('navbar'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobileMenu: document.getElementById('mobileMenu'),
    loginBtn: document.getElementById('loginBtn'),
    profileBtn: document.getElementById('profileBtn'),
    usernameDisplay: document.getElementById('usernameDisplay'),
    mobileUsernameDisplay: document.getElementById('mobileUsernameDisplay'),

    addTransactionHead: document.getElementById("add-transactionHead"),
    transactionsHead: document.getElementById("transactionsHead"),
    dashboardHead: document.getElementById("dashboardHead"),

    // Auth modal
    authModal: document.getElementById('authModal'),
    authForm: document.getElementById('authForm'),
    authModalTitle: document.getElementById('authModalTitle'),
    authSubmitBtn: document.getElementById('authSubmitBtn'),
    toggleAuthMode: document.getElementById('toggleAuthMode'),
    authUsername: document.getElementById('authUsername'),
    authPassword: document.getElementById('authPassword'),
    authError: document.getElementById('authError'),
    closeAuthModal: document.getElementById('closeAuthModal'),
    //startLoginBtn: document.getElementById('startLoginBtn'),

    // Content area
    welcomeSection: document.getElementById('welcomeSection'),
    appContent: document.getElementById('appContent'),

    // Dashboard
    incomeAmount: document.getElementById('incomeAmount'),
    expenseAmount: document.getElementById('expenseAmount'),
    balanceAmount: document.getElementById('balanceAmount'),
    incomeChange: document.getElementById('incomeChange'),
    expenseChange: document.getElementById('expenseChange'),
    balanceChange: document.getElementById('balanceChange'),
    trendChart: document.getElementById('trendChart'),
    expenseCategoryChart: document.getElementById('expenseCategoryChart'),
    trendFilterBtns: document.querySelectorAll('.trend-filter-btn'),

    // Transactions
    transactionTableBody: document.getElementById('transactionTableBody'),
    transactionCount: document.getElementById('transactionCount'),
    transactionSearch: document.getElementById('transactionSearch'),
    transactionFilter: document.getElementById('transactionFilter'),

    // Add transaction form
    transactionForm: document.getElementById('transactionForm'),
    transactionType: document.querySelectorAll('input[name="transactionType"]'),
    transactionDate: document.getElementById('transactionDate'),
    transactionDescription: document.getElementById('transactionDescription'),
    transactionCategory: document.getElementById('transactionCategory'),
    transactionAmount: document.getElementById('transactionAmount'),
    transactionFormError: document.getElementById('transactionFormError'),
    resetTransactionForm: document.getElementById('resetTransactionForm'),

    // Edit transaction modal
    editTransactionModal: document.getElementById('editTransactionModal'),
    editTransactionForm: document.getElementById('editTransactionForm'),
    editTransactionId: document.getElementById('editTransactionId'),
    editTransactionType: document.querySelectorAll('input[name="editTransactionType"]'),
    editTransactionDate: document.getElementById('editTransactionDate'),
    editTransactionDescription: document.getElementById('editTransactionDescription'),
    editTransactionCategory: document.getElementById('editTransactionCategory'),
    editTransactionAmount: document.getElementById('editTransactionAmount'),
    editTransactionFormError: document.getElementById('editTransactionFormError'),
    closeEditModal: document.getElementById('closeEditModal'),
    deleteTransactionBtn: document.getElementById('deleteTransactionBtn'),
    cancelEditBtn: document.getElementById('cancelEditBtn'),

    // Notification
    notification: document.getElementById('notification'),
    notificationIcon: document.getElementById('notificationIcon'),
    notificationTitle: document.getElementById('notificationTitle'),
    notificationMessage: document.getElementById('notificationMessage'),
    closeNotification: document.getElementById('closeNotification')
};

// Initialize app
function initApp() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    elements.transactionDate.value = today;

    // Load user data
    loadUsers();

    // Check authentication
    checkAuthentication();


    // Register event listeners
    registerEventListeners();


    // Initialize charts
    initCharts();
}

// Load user data
function loadUsers() {
    try {
        const usersData = localStorage.getItem('financeTrackerUsers');
        if (usersData) {
            appState.users = JSON.parse(usersData);
        }
    } catch (error) {
        console.error('Failed to load users data:', error);
        showNotification('Error', 'Failed to load user data', 'error');
    }
}

// Save user data
function saveUsers() {
    try {
        localStorage.setItem('financeTrackerUsers', JSON.stringify(appState.users));
    } catch (error) {
        console.error('Failed to save users data:', error);
        showNotification('Error', 'Failed to save user data', 'error');
    }
}

// Check authentication
function checkAuthentication() {
    const userId = localStorage.getItem('financeTrackerUserId');
    if (userId && appState.users[userId]) {
        appState.currentUser = appState.users[userId];
        appState.isAuthenticated = true;
        appState.transactions = appState.currentUser.transactions || [];
        // Update UI
        updateAuthenticatedUI();
        updateDashboard();
        renderTransactions();
    } else {
        updateUnauthenticatedUI();
    }
}

// Update UI for authenticated state
function updateAuthenticatedUI() {
    elements.welcomeSection.classList.add('hidden');

    elements.appContent.classList.remove('hidden');
    elements.usernameDisplay.textContent = appState.currentUser.username;
    elements.mobileUsernameDisplay.textContent = appState.currentUser.username;
    elements.loginBtn.textContent = 'Logout';
    elements.loginBtn.removeEventListener('click', showAuthModal);
    elements.loginBtn.addEventListener('click', logout);
    elements.profileBtn.classList.remove('hidden');

    elements.dashboardHead.removeEventListener('click', showAuthModal);
    elements.transactionsHead.removeEventListener('click', showAuthModal);
    elements.addTransactionHead.removeEventListener('click', showAuthModal);


}

// Update UI for unauthenticated state
function updateUnauthenticatedUI() {
    elements.welcomeSection.classList.remove('hidden');
    elements.appContent.classList.add('hidden');
    elements.usernameDisplay.textContent = 'Not logged in';
    elements.mobileUsernameDisplay.textContent = 'Not logged in';
    elements.loginBtn.textContent = 'Login';
    elements.loginBtn.removeEventListener('click', logout);
    elements.loginBtn.addEventListener('click', showAuthModal);
    elements.profileBtn.classList.add('hidden');
}

// Register event listeners
function registerEventListeners() {

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            elements.navbar.classList.add('shadow-md');
        } else {
            elements.navbar.classList.remove('shadow-md');
        }
    });


    // Mobile menu
    elements.mobileMenuBtn.addEventListener('click', () => {
        elements.mobileMenu.classList.toggle('hidden');
    });



    // Auth modal
    elements.loginBtn.addEventListener('click', showAuthModal);


    elements.dashboardHead.addEventListener('click', showAuthModal);
    elements.transactionsHead.addEventListener('click', showAuthModal);
    elements.addTransactionHead.addEventListener('click', showAuthModal);

    //elements.startLoginBtn.addEventListener('click', showAuthModal);

    elements.closeAuthModal.addEventListener('click', hideAuthModal);


    elements.authForm.addEventListener('submit', handleAuth);
    elements.toggleAuthMode.addEventListener('click', toggleAuthMode);


    // Add transaction form
    elements.transactionForm.addEventListener('submit', handleAddTransaction);
    elements.resetTransactionForm.addEventListener('click', resetTransactionForm);

    // Transaction type change
    elements.transactionType.forEach(radio => {
        radio.addEventListener('change', updateCategoryOptions);
    });

    // Search and filter
    elements.transactionSearch.addEventListener('input', filterTransactions);
    elements.transactionFilter.addEventListener('change', filterTransactions);

    // Trend chart filter
    elements.trendFilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            elements.trendFilterBtns.forEach(b => {
                b.classList.remove('bg-primary', 'text-white');
                b.classList.add('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
            });
            e.target.classList.remove('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
            e.target.classList.add('bg-primary', 'text-white');
            updateDashboard();
        });
    });

    // Edit transaction modal
    elements.closeEditModal.addEventListener('click', hideEditModal);
    elements.cancelEditBtn.addEventListener('click', hideEditModal);
    elements.editTransactionForm.addEventListener('submit', handleEditTransaction);
    elements.deleteTransactionBtn.addEventListener('click', handleDeleteTransaction);

    // Edit transaction type change
    elements.editTransactionType.forEach(radio => {
        radio.addEventListener('change', updateEditCategoryOptions);
    });

    // Notification
    elements.closeNotification.addEventListener('click', hideNotification);
}

// Initialize charts
function initCharts() {
    // Trend chart
    window.trendChart = new Chart(elements.trendChart, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Income',
                    data: [],
                    borderColor: '#52C41A',
                    backgroundColor: 'rgba(82, 196, 26, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Expense',
                    data: [],
                    borderColor: '#FF4D4F',
                    backgroundColor: 'rgba(255, 77, 79, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CNY' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '¥' + value;
                        }
                    }
                }
            }
        }
    });

    // Expense category chart
    window.expenseCategoryChart = new Chart(elements.expenseCategoryChart, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#165DFF', '#36CFC9', '#52C41A', '#FAAD14',
                    '#FF4D4F', '#722ED1', '#FA541C', '#13C2C2'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ¥${value} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Show auth modal
function showAuthModal() {
    elements.authModal.classList.remove('hidden');
    elements.authModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

// Hide auth modal
function hideAuthModal() {
    elements.authModal.classList.add('hidden');
    elements.authModal.classList.remove('flex');
    document.body.style.overflow = '';
    elements.authError.classList.add('hidden');
    elements.authError.textContent = '';
}

// Toggle login/register mode
function toggleAuthMode() {
    if (elements.authModalTitle.textContent === 'Login') {
        elements.authModalTitle.textContent = 'Register';
        elements.authSubmitBtn.textContent = 'Register';
        elements.toggleAuthMode.textContent = 'Already have an account? Login';
    } else {
        elements.authModalTitle.textContent = 'Login';
        elements.authSubmitBtn.textContent = 'Login';
        elements.toggleAuthMode.textContent = "Don't have an account? Register";
    }
    elements.authError.classList.add('hidden');
    elements.authError.textContent = '';
}

// Handle login/register
function handleAuth(e) {
    e.preventDefault();
    const username = elements.authUsername.value.trim();
    const password = elements.authPassword.value;
    // Basic validation
    if (!username || !password) {
        showAuthError('Username and password cannot be empty');
        return;
    }
    if (elements.authModalTitle.textContent === 'Login') {


        // Login logic
        login(username, password);
    } else {
        // Register logic
        register(username, password);
    }
}

// Login
function login(username, password) {
    const user = Object.values(appState.users).find(user => user.username === username);
    if (!user || user.password !== password) {
        showAuthError('Incorrect username or password');
        return;
    }
    // Login success
    appState.currentUser = user;
    appState.isAuthenticated = true;
    appState.transactions = user.transactions || [];
    // Save user ID to localStorage
    localStorage.setItem('financeTrackerUserId', user.id);
    // Update UI

    hideAuthModal();


    updateAuthenticatedUI();
    updateDashboard();
    renderTransactions();

    showNotification('Login successful', `Welcome back, ${username}!`, 'success');
}

// Register
function register(username, password) {
    // Check if username exists
    const userExists = Object.values(appState.users).some(user => user.username === username);
    if (userExists) {
        showAuthError('This username is already registered');
        return;
    }
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        username,
        password,
        transactions: []
    };
    // Add to user list
    appState.users[newUser.id] = newUser;
    saveUsers();
    // Auto login
    login(username, password);
    showNotification('Registration successful', 'You have successfully registered and logged in', 'success');
}

// Show auth error
function showAuthError(message) {
    elements.authError.textContent = message;
    elements.authError.classList.remove('hidden');
}

// Logout
function logout() {
    appState.currentUser = null;
    appState.isAuthenticated = false;
    appState.transactions = [];
    // Clear localStorage
    localStorage.removeItem('financeTrackerUserId');
    // Update UI
    updateUnauthenticatedUI();
    showNotification('Logout successful', 'You have successfully logged out', 'info');
}

// Handle add transaction
function handleAddTransaction(e) {
    e.preventDefault();
    const type = document.querySelector('input[name="transactionType"]:checked').value;
    const date = elements.transactionDate.value;
    const description = elements.transactionDescription.value.trim();
    const category = elements.transactionCategory.value;
    const amount = parseFloat(elements.transactionAmount.value);
    // Validation
    if (!description) {
        showTransactionFormError('Please enter a transaction description');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        showTransactionFormError('Please enter a valid amount');
        return;
    }
    // Create new transaction
    const newTransaction = {
        id: Date.now().toString(),
        type,
        date,
        description,
        category,
        amount
    };
    // Add to transaction list
    appState.transactions.push(newTransaction);
    // Update user data
    appState.currentUser.transactions = appState.transactions;
    appState.users[appState.currentUser.id] = appState.currentUser;
    saveUsers();
    // Update UI
    resetTransactionForm();
    updateDashboard();
    renderTransactions();
    hideEditModal();
    showNotification('Added successfully', 'Transaction has been added successfully', 'success');
}

// Reset transaction form
function resetTransactionForm() {
    elements.transactionForm.reset();
    elements.transactionDate.value = new Date().toISOString().split('T')[0];
    elements.transactionFormError.classList.add('hidden');
    elements.transactionFormError.textContent = '';
}

// Show transaction form error
function showTransactionFormError(message) {
    elements.transactionFormError.textContent = message;
    elements.transactionFormError.classList.remove('hidden');
}

// Update category options based on transaction type
function updateCategoryOptions() {
    const type = document.querySelector('input[name="transactionType"]:checked').value;
    const incomeOptions = document.querySelectorAll('optgroup[label="Income Category"] option');
    const expenseOptions = document.querySelectorAll('optgroup[label="Expense Category"] option');
    if (type === 'income') {
        incomeOptions.forEach(option => option.disabled = false);
        expenseOptions.forEach(option => option.disabled = true);
        elements.transactionCategory.value = 'salary';
    } else {
        incomeOptions.forEach(option => option.disabled = true);
        expenseOptions.forEach(option => option.disabled = false);
        elements.transactionCategory.value = 'food';
    }
}

// Update edit category options based on transaction type
function updateEditCategoryOptions() {
    const type = document.querySelector('input[name="editTransactionType"]:checked').value;
    const incomeOptions = document.querySelectorAll('optgroup[label="Income Category"] option');
    const expenseOptions = document.querySelectorAll('optgroup[label="Expense Category"] option');
    if (type === 'income') {
        incomeOptions.forEach(option => option.disabled = false);
        expenseOptions.forEach(option => option.disabled = true);
        elements.editTransactionCategory.value = 'salary';
    } else {
        incomeOptions.forEach(option => option.disabled = true);
        expenseOptions.forEach(option => option.disabled = false);
        elements.editTransactionCategory.value = 'food';
    }
}

// Render transactions
function renderTransactions() {
    // Apply filters
    const searchTerm = elements.transactionSearch.value.toLowerCase().trim();
    const filterType = elements.transactionFilter.value;
    let filteredTransactions = appState.transactions;
    // Search filter
    if (searchTerm) {
        filteredTransactions = filteredTransactions.filter(transaction =>
            transaction.description.toLowerCase().includes(searchTerm) ||
            transaction.category.toLowerCase().includes(searchTerm)
        );
    }
    // Type filter
    if (filterType !== 'all') {
        filteredTransactions = filteredTransactions.filter(transaction =>
            transaction.type === filterType
        );
    }
    // Sort by date (latest first)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    // Update count
    elements.transactionCount.textContent = filteredTransactions.length;
    // Clear table
    elements.transactionTableBody.innerHTML = '';
    // If no transactions
    if (filteredTransactions.length === 0) {
        elements.transactionTableBody.innerHTML = `
            <tr class="text-center">
                <td colspan="5" class="px-6 py-12 text-gray-500">
                    <div class="flex flex-col items-center">
                        <i class="fa fa-file-text-o text-4xl mb-4 text-gray-300"></i>
                        <p>No transactions</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    // Render transactions
    filteredTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-custom';
        row.setAttribute('data-id', transaction.id);
        // Format date
        const date = new Date(transaction.date);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        // Format amount
        const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CNY' }).format(transaction.amount);
        // Set category display names
        const categoryDisplayNames = {
            // Income categories
            salary: 'Salary',
            bonus: 'Bonus',
            investment: 'Investment',
            other_income: 'Other Income',
            // Expense categories
            food: 'Food',
            transportation: 'Transportation',
            housing: 'Housing',
            shopping: 'Shopping',
            entertainment: 'Entertainment',
            medical: 'Medical',
            education: 'Education',
            other_expense: 'Other Expense'
        };
        const categoryName = categoryDisplayNames[transaction.category] || transaction.category;
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${formattedDate}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-8 h-8 rounded-lg ${transaction.type === 'income' ? 'bg-success/10' : 'bg-danger/10'} flex items-center justify-center mr-3">
                        <i class="fa ${transaction.type === 'income' ? 'fa-arrow-down text-success' : 'fa-arrow-up text-danger'}"></i>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-gray-900">${transaction.description}</div>
                        <div class="text-xs text-gray-500">${transaction.type === 'income' ? 'Income' : 'Expense'}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${categoryName}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.type === 'income' ? 'text-success' : 'text-danger'}">
                ${transaction.type === 'income' ? '+' : '-'}${formattedAmount}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-primary hover:text-primary/80 mr-3 edit-btn">
                    <i class="fa fa-pencil"></i> Edit
                </button>
                <button class="text-danger hover:text-danger/80 delete-btn">
                    <i class="fa fa-trash"></i> Delete
                </button>
            </td>
        `;
        elements.transactionTableBody.appendChild(row);
        // Add edit and delete event listeners
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        editBtn.addEventListener('click', () => {
            openEditModal(transaction);
        });
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this transaction?')) {
                deleteTransaction(transaction.id);
            }
        });
    });
}

// Filter transactions
function filterTransactions() {
    renderTransactions();
}

// Open edit modal
function openEditModal(transaction) {
    elements.editTransactionId.value = transaction.id;
    // Set transaction type
    elements.editTransactionType.forEach(radio => {
        if (radio.value === transaction.type) {
            radio.checked = true;
        }
    });
    // Update category options
    updateEditCategoryOptions();
    // Set other fields
    elements.editTransactionDate.value = transaction.date;
    elements.editTransactionDescription.value = transaction.description;
    elements.editTransactionCategory.value = transaction.category;
    elements.editTransactionAmount.value = transaction.amount;
    // Show modal
    elements.editTransactionModal.classList.remove('hidden');
    elements.editTransactionModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

// Hide edit modal
function hideEditModal() {
    elements.editTransactionModal.classList.add('hidden');
    elements.editTransactionModal.classList.remove('flex');
    document.body.style.overflow = '';
    elements.editTransactionFormError.classList.add('hidden');
    elements.editTransactionFormError.textContent = '';
}

// Handle edit transaction
function handleEditTransaction(e) {
    e.preventDefault();
    const id = elements.editTransactionId.value;
    const type = document.querySelector('input[name="editTransactionType"]:checked').value;
    const date = elements.editTransactionDate.value;
    const description = elements.editTransactionDescription.value.trim();
    const category = elements.editTransactionCategory.value;
    const amount = parseFloat(elements.editTransactionAmount.value);
    // Validation
    if (!description) {
        showEditTransactionFormError('Please enter a transaction description');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        showEditTransactionFormError('Please enter a valid amount');
        return;
    }
    // Find transaction to edit
    const transactionIndex = appState.transactions.findIndex(t => t.id === id);
    if (transactionIndex === -1) {
        showEditTransactionFormError('Transaction not found');
        return;
    }
    // Update transaction
    appState.transactions[transactionIndex] = {
        ...appState.transactions[transactionIndex],
        type,
        date,
        description,
        category,
        amount
    };
    // Update user data
    appState.currentUser.transactions = appState.transactions;
    appState.users[appState.currentUser.id] = appState.currentUser;
    saveUsers();
    // Update UI
    updateDashboard();
    renderTransactions();
    hideEditModal();
    showNotification('Updated successfully', 'Transaction has been updated successfully', 'success');
}

// Show edit transaction form error
function showEditTransactionFormError(message) {
    elements.editTransactionFormError.textContent = message;
    elements.editTransactionFormError.classList.remove('hidden');
}

// Handle delete transaction
function handleDeleteTransaction() {
    const id = elements.editTransactionId.value;
    if (confirm('Are you sure you want to delete this transaction?')) {
        deleteTransaction(id);
        hideEditModal();
    }
}

// Delete transaction
function deleteTransaction(id) {
    // Find transaction to delete
    const transactionIndex = appState.transactions.findIndex(t => t.id === id);
    if (transactionIndex === -1) {
        showNotification('Error', 'Transaction not found', 'error');
        return;
    }
    // Delete transaction
    appState.transactions.splice(transactionIndex, 1);
    // Update user data
    appState.currentUser.transactions = appState.transactions;
    appState.users[appState.currentUser.id] = appState.currentUser;
    saveUsers();
    // Update UI
    updateDashboard();
    renderTransactions();
    showNotification('Deleted successfully', 'Transaction has been deleted successfully', 'success');
}

// Update dashboard
function updateDashboard() {
    // Get current filter type
    const filterType = document.querySelector('.trend-filter-btn.bg-primary').textContent;
    // Calculate total income, expense, and balance
    let totalIncome = 0;
    let totalExpense = 0;
    // Calculate based on filter type
    if (filterType === 'Month') {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        // Current month data
        const currentMonthTransactions = appState.transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });
        // Last month data
        let lastMonth = currentMonth - 1;
        let lastMonthYear = currentYear;
        if (lastMonth < 0) {
            lastMonth = 11;
            lastMonthYear = currentYear - 1;
        }
        const lastMonthTransactions = appState.transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        });
        // Current month income and expense
        totalIncome = currentMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        totalExpense = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        // Last month income and expense
        const lastMonthIncome = lastMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const lastMonthExpense = lastMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        // Update change percent
        const incomeChange = lastMonthIncome > 0
            ? ((totalIncome - lastMonthIncome) / lastMonthIncome * 100).toFixed(1)
            : (totalIncome > 0 ? '100.0' : '0');
        const expenseChange = lastMonthExpense > 0
            ? ((totalExpense - lastMonthExpense) / lastMonthExpense * 100).toFixed(1)
            : (totalExpense > 0 ? '100.0' : '0');
        elements.incomeChange.textContent = `${incomeChange > 0 ? '+' : ''}${incomeChange}%`;
        elements.expenseChange.textContent = `${expenseChange > 0 ? '+' : ''}${expenseChange}%`;
        // Update trend chart
        updateTrendChart('month');
    } else if (filterType === 'Quarter') {
        // Quarter data logic
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const currentQuarter = Math.floor(currentMonth / 3) + 1;
        // Current quarter data
        const currentQuarterTransactions = appState.transactions.filter(t => {
            const date = new Date(t.date);
            const month = date.getMonth();
            const quarter = Math.floor(month / 3) + 1;
            return quarter === currentQuarter && date.getFullYear() === currentYear;
        });
        // Last quarter data
        let lastQuarter = currentQuarter - 1;
        let lastQuarterYear = currentYear;
        if (lastQuarter < 1) {
            lastQuarter = 4;
            lastQuarterYear = currentYear - 1;
        }
        const lastQuarterTransactions = appState.transactions.filter(t => {
            const date = new Date(t.date);
            const month = date.getMonth();
            const quarter = Math.floor(month / 3) + 1;
            return quarter === lastQuarter && date.getFullYear() === lastQuarterYear;
        });
        // Current quarter income and expense
        totalIncome = currentQuarterTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        totalExpense = currentQuarterTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        // Last quarter income and expense
        const lastQuarterIncome = lastQuarterTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const lastQuarterExpense = lastQuarterTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        // Update change percent
        const incomeChange = lastQuarterIncome > 0
            ? ((totalIncome - lastQuarterIncome) / lastQuarterIncome * 100).toFixed(1)
            : (totalIncome > 0 ? '100.0' : '0');
        const expenseChange = lastQuarterExpense > 0
            ? ((totalExpense - lastQuarterExpense) / lastQuarterExpense * 100).toFixed(1)
            : (totalExpense > 0 ? '100.0' : '0');
        elements.incomeChange.textContent = `${incomeChange > 0 ? '+' : ''}${incomeChange}%`;
        elements.expenseChange.textContent = `${expenseChange > 0 ? '+' : ''}${expenseChange}%`;
        // Update trend chart
        updateTrendChart('quarter');
    } else {
        // Year data logic
        const currentYear = new Date().getFullYear();
        // Current year data
        const currentYearTransactions = appState.transactions.filter(t => {
            const date = new Date(t.date);
            return date.getFullYear() === currentYear;
        });
        // Last year data
        const lastYearTransactions = appState.transactions.filter(t => {
            const date = new Date(t.date);
            return date.getFullYear() === currentYear - 1;
        });
        // Current year income and expense
        totalIncome = currentYearTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        totalExpense = currentYearTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        // Last year income and expense
        const lastYearIncome = lastYearTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const lastYearExpense = lastYearTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        // Update change percent
        const incomeChange = lastYearIncome > 0
            ? ((totalIncome - lastYearIncome) / lastYearIncome * 100).toFixed(1)
            : (totalIncome > 0 ? '100.0' : '0');
        const expenseChange = lastYearExpense > 0
            ? ((totalExpense - lastYearExpense) / lastYearExpense * 100).toFixed(1)
            : (totalExpense > 0 ? '100.0' : '0');
        elements.incomeChange.textContent = `${incomeChange > 0 ? '+' : ''}${incomeChange}%`;
        elements.expenseChange.textContent = `${expenseChange > 0 ? '+' : ''}${expenseChange}%`;
        // Update trend chart
        updateTrendChart('year');
    }
    // Calculate balance
    const balance = totalIncome - totalExpense;
    // Update display
    elements.incomeAmount.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CNY' }).format(totalIncome);
    elements.expenseAmount.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CNY' }).format(totalExpense);
    elements.balanceAmount.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CNY' }).format(balance);
    // Set balance color
    if (balance > 0) {
        elements.balanceAmount.classList.remove('text-danger');
        elements.balanceAmount.classList.add('text-success');
    } else if (balance < 0) {
        elements.balanceAmount.classList.remove('text-success');
        elements.balanceAmount.classList.add('text-danger');
    } else {
        elements.balanceAmount.classList.remove('text-success', 'text-danger');
    }
    // Update expense category chart
    updateExpenseCategoryChart();
}

// Update trend chart
function updateTrendChart(filterType) {
    const labels = [];
    const incomeData = [];
    const expenseData = [];
    if (filterType === 'month') {
        // Monthly data - last 12 months
        const currentDate = new Date();
        for (let i = 11; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthName = date.toLocaleString('en-US', { month: 'short' });
            labels.push(monthName);
            const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            const monthTransactions = appState.transactions.filter(t => {
                const transactionDate = new Date(t.date);
                return transactionDate >= startDate && transactionDate <= endDate;
            });
            const monthIncome = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            const monthExpense = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            incomeData.push(monthIncome);
            expenseData.push(monthExpense);
        }
    } else if (filterType === 'quarter') {
        // Quarterly data - last 8 quarters
        const currentDate = new Date();
        const currentQuarter = Math.floor(currentDate.getMonth() / 3) + 1;
        const currentYear = currentDate.getFullYear();
        for (let i = 7; i >= 0; i--) {
            let quarter = (currentQuarter+(8-i))%4+1
            let year = currentYear - Math.floor((i + currentQuarter - 1) / 4);
            labels.push(`${year} Q${quarter}`);
            const startMonth = (quarter - 1) * 3;
            const endMonth = startMonth + 2;
            const startDate = new Date(year, startMonth, 1);
            const endDate = new Date(year, endMonth + 1, 0);
            const quarterTransactions = appState.transactions.filter(t => {
                const transactionDate = new Date(t.date);
                return transactionDate >= startDate && transactionDate <= endDate;
            });
            const quarterIncome = quarterTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            const quarterExpense = quarterTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            incomeData.push(quarterIncome);
            expenseData.push(quarterExpense);
        }
    } else {
        // Yearly data - last 5 years
        const currentYear = new Date().getFullYear();
        for (let i = 4; i >= 0; i--) {
            const year = currentYear - i;
            labels.push(`${year}`);
            const yearTransactions = appState.transactions.filter(t => {
                const transactionDate = new Date(t.date);
                return transactionDate.getFullYear() === year;
            });
            const yearIncome = yearTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            const yearExpense = yearTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            incomeData.push(yearIncome);
            expenseData.push(yearExpense);
        }
    }
    // Update chart data
    window.trendChart.data.labels = labels;
    window.trendChart.data.datasets[0].data = incomeData;
    window.trendChart.data.datasets[1].data = expenseData;
    window.trendChart.update();
}

// Update expense category chart
function updateExpenseCategoryChart() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    // Get current month expense transactions
    const currentMonthTransactions = appState.transactions.filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    // Sum by category
    const categoryTotals = {};
    currentMonthTransactions.forEach(transaction => {
        if (!categoryTotals[transaction.category]) {
            categoryTotals[transaction.category] = 0;
        }
        categoryTotals[transaction.category] += transaction.amount;
    });
    // Sort and take top 8 categories, others as "Other"
    const sortedCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1]);
    const labels = [];
    const data = [];
    // Set category display names
    const categoryDisplayNames = {
        food: 'Food',
        transportation: 'Transportation',
        housing: 'Housing',
        shopping: 'Shopping',
        entertainment: 'Entertainment',
        medical: 'Medical',
        education: 'Education',
        other_expense: 'Other Expense'
    };
    let otherTotal = 0;
    sortedCategories.forEach(([category, amount], index) => {
        if (index < 7) {
            labels.push(categoryDisplayNames[category] || category);
            data.push(amount);
        } else {
            otherTotal += amount;
        }
    });
    if (otherTotal > 0) {
        labels.push('Other');
        data.push(otherTotal);
    }
    // Update chart data
    window.expenseCategoryChart.data.labels = labels;
    window.expenseCategoryChart.data.datasets[0].data = data;
    window.expenseCategoryChart.update();
}

// Show notification
function showNotification(title, message, type = 'info') {
    // Set notification type style
    elements.notificationIcon.className = 'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white mr-3';
    if (type === 'success') {
        elements.notificationIcon.classList.add('bg-success');
        elements.notificationIcon.innerHTML = '<i class="fa fa-check"></i>';
    } else if (type === 'error') {
        elements.notificationIcon.classList.add('bg-danger');
        elements.notificationIcon.innerHTML = '<i class="fa fa-exclamation"></i>';
    } else if (type === 'warning') {
        elements.notificationIcon.classList.add('bg-warning');
        elements.notificationIcon.innerHTML = '<i class="fa fa-exclamation-triangle"></i>';
    } else {
        elements.notificationIcon.classList.add('bg-primary');
        elements.notificationIcon.innerHTML = '<i class="fa fa-info"></i>';
    }
    // Set notification content
    elements.notificationTitle.textContent = title;
    elements.notificationMessage.textContent = message;
    // Show notification
    elements.notification.classList.remove('translate-x-full', 'opacity-0');
    elements.notification.classList.add('translate-x-0', 'opacity-100');
    // Auto close
    clearTimeout(window.notificationTimeout);
    window.notificationTimeout = setTimeout(hideNotification, 4000);
}

// Hide notification
function hideNotification() {
    elements.notification.classList.remove('translate-x-0', 'opacity-100');
    elements.notification.classList.add('translate-x-full', 'opacity-0');
}

// Initialize app on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initApp);
