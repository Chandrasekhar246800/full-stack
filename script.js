let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

document.getElementById('date').valueAsDate = new Date();

document.getElementById('transactionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    transactions.push({
        id: Date.now(),
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        type: document.getElementById('type').value,
        category: document.getElementById('category').value,
        date: document.getElementById('date').value
    });

    localStorage.setItem('transactions', JSON.stringify(transactions));
    document.getElementById('transactionForm').reset();
    document.getElementById('date').valueAsDate = new Date();
    render();
});

document.getElementById('filterType').addEventListener('change', render);
document.getElementById('filterCategory').addEventListener('change', render);

function render() {
    let filtered = transactions;
    let filterType = document.getElementById('filterType').value;
    let filterCategory = document.getElementById('filterCategory').value;

    if (filterType !== 'all') filtered = filtered.filter(t => t.type === filterType);
    if (filterCategory !== 'all') filtered = filtered.filter(t => t.category === filterCategory);

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    let income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    let expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    document.getElementById('totalIncome').textContent = '$' + income.toFixed(2);
    document.getElementById('totalExpenses').textContent = '$' + expenses.toFixed(2);
    document.getElementById('balance').textContent = '$' + (income - expenses).toFixed(2);

    let html = '';
    if (filtered.length === 0) {
        html = '<div class="empty-state"><h3>No transactions found</h3></div>';
    } else {
        filtered.forEach(t => {
            html += `<div class="transaction-item ${t.type}">
                <div class="transaction-info">
                    <div class="transaction-description">${t.description}</div>
                    <div class="transaction-details">${t.category} • ${new Date(t.date).toLocaleDateString('en-US', {year:'numeric',month:'short',day:'numeric'})}</div>
                </div>
                <div class="transaction-amount ${t.type}">
                    ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
                </div>
                <div class="transaction-actions">
                    <button class="btn-icon btn-delete" onclick="deleteTransaction(${t.id})">Delete</button>
                </div>
            </div>`;
        });
    }
    document.getElementById('transactionsList').innerHTML = html;

    let categories = [...new Set(transactions.map(t => t.category))];
    let categorySelect = document.getElementById('filterCategory');
    let currentCategory = categorySelect.value;
    categorySelect.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(c => categorySelect.innerHTML += `<option value="${c}">${c}</option>`);
    categorySelect.value = currentCategory;
}

function deleteTransaction(id) {
    if (confirm('Delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        render();
    }
}

render();
