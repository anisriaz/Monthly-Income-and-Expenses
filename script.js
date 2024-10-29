let iD = document.querySelector('#id');
let income = document.querySelector('#income');
let incomeDesc = document.querySelector('#incomeDesc');
let date = document.querySelector('#date');
let allIncomContain = document.querySelector('#allIcomesContainer');
let allExpensesContain = document.querySelector('#allExpensesContainer');
let search = document.querySelector('#search');

let allIncomes = [];
let allExpenses = [];
let editIndex = -1;

// Load expenses from local storage
let storedExpenses = localStorage.getItem('allExpenses');
if (storedExpenses) {
    allExpenses = JSON.parse(storedExpenses);
};

// Load incomes from local storage
let storedIncomes = localStorage.getItem('allIncomes');
if (storedIncomes) {
    allIncomes = JSON.parse(storedIncomes);
};

displayIncomes();

function addIncomes() {
    let addId = iD.value;
    let addIncome = income.value;
    let addIncomeDesc = incomeDesc.value;
    let addDate = date.value;

    if( !addId || !addIncome || !addIncomeDesc || !addDate){
        alert("Error: All fields are required..");
        return;
    };
    const idExists = allIncomes.some(income => income.Id === addId);
    if (idExists) {
        alert("Error: ID already exists. Please use a unique ID.");
        return; 
    }
  
    allIncomes.push({ Id: addId, Income: addIncome, IncomeDesc: addIncomeDesc, Date: addDate });

    localStorage.setItem('allIncomes', JSON.stringify(allIncomes));

    income.value = "";
    iD.value = "";
    incomeDesc.value = "";
    date.value = "";

    displayIncomes();
};

function displayIncomes() {
    let incomesInfo = allIncomContain;
    let showIncomes = '';

    // Load incomes from local storage
    let storedIncomes = localStorage.getItem('allIncomes');
    if (storedIncomes) {
        allIncomes = JSON.parse(storedIncomes);
    }

    // Display each income
    for (let i = 0; i < allIncomes.length; i++) {
        let { Income, Id, IncomeDesc, Date } = allIncomes[i];

        console.log(Id)
        showIncomes += `
            <div class="expense-card">
                <div class="income-details">
                    <span>ID: ${Id}</span><br>
                    <span>Amount: ${Income}</span><br>
                    <span>Description: ${IncomeDesc}</span><br>
                    <span>Date: ${Date}</span>
                    <div class="duoButton">
                    <button onClick="addOutcome('${Id}')">Add Expense</button>
                    <button class="edit" onClick="editIncomes(${i})">Edit</button>
                    <button class="delete" onClick="deleteBook(${i})">Delete</button>
                 </div>
                 </div>
                <div class="expenses-section">
                    <h4>Expenses:</h4>
                    <div id="expensesFor${Id}"></div> <!-- Placeholder for expenses -->
                </div>
            </div>
        `;
    }

    // Insert incomes into the DOM
    incomesInfo.innerHTML = showIncomes;

    // Now display expenses for each income
    for (let i = 0; i < allIncomes.length; i++) {
        let { Id } = allIncomes[i];
        displayExpensesForIncome(Id);
    }
};

function addOutcome(id) {
    document.getElementById("popup").style.display = "block";
    document.getElementById("currentExpenseId").value = id;

};

function closePopup() {
    document.getElementById("popup").style.display = "none";
};

function submitPopup() {
    const expenseId = document.getElementById("currentExpenseId").value;
    const amountToDeduct = parseFloat(document.getElementById("amountSpend").value);
    const catgoryId = document.getElementById("catgory").value;
    const dateId = document.getElementById("addDate").value;

    const index = allIncomes.findIndex(expense => expense.Id === expenseId);



    allExpenses.push({ incomeId: expenseId, AmountDeducted: amountToDeduct, Category: catgoryId, expensesDate: dateId });
    localStorage.setItem('allExpenses', JSON.stringify(allExpenses));


    document.getElementById("amountSpend").value = '';
    document.getElementById("catgory").value = '';
    document.getElementById("addDate").value = '';

    if (index !== -1) {
        let existingAmount = parseFloat(allIncomes[index].Income);
        if (!isNaN(amountToDeduct) && amountToDeduct > 0) {
            let newAmount = existingAmount - amountToDeduct;

            if (newAmount < 0) {
                alert("Insufficient funds. Please enter a lower amount.");
            } else {
                allIncomes[index].Income = newAmount.toFixed(2);
                localStorage.setItem('allIncomes', JSON.stringify(allIncomes));
                displayIncomes();
            }
        } else {
            alert("Please enter a valid spend amount.");
        }
    }

    closePopup();
};

function displayExpensesForIncome(incomeId) {
    let expensesInfo = document.getElementById(`expensesFor${incomeId}`);
    let showExpenses = '';

    console.log(expensesInfo)
    let storedExpenses = localStorage.getItem('allExpenses');
    if (storedExpenses) {
        allExpenses = JSON.parse(storedExpenses);
    }

    const filteredExpenses = allExpenses.filter(expense => expense.incomeId === incomeId);

    for (let i = 0; i < filteredExpenses.length; i++) {
        let { AmountDeducted, Category, expensesDate } = allExpenses[i];

        showExpenses += `
            <div class="expense-item">
        <span>Amount: ${AmountDeducted}</span>
        <span>Category: ${Category}</span>
        <span>Date: ${expensesDate}</span>
    </div>
        `;
    };

    expensesInfo.innerHTML = showExpenses;
};

function searchFunc() {
    let searchBar = search.value.toLowerCase();
    let filtersIncome = allIncomes.filter(item =>
        item.Id.toLowerCase().includes(searchBar) ||
        item.IncomeDesc.toLowerCase().includes(searchBar)
    );
    allIncomContain.innerHTML = filtersIncome.length === 0
        ? `<div class="income-details">No Result Found.</div>`
        : filtersIncome.map(({ Id, Income, IncomeDesc, Date }, i) => `
       <div class="expense-card">
                <div class="income-details">
                    <span>ID: ${Id}</span><br>
                    <span>Amount: ${Income}</span><br>
                    <span>Description: ${IncomeDesc}</span><br>
                    <span>Date: ${Date}</span>
                    <button onClick="addOutcome('${Id}')">Add Expense</button>
                    <button class="delete" onClick="deleteBook(${i})">Delete</button>
                </div>
`
        );
};

function editIncomes(index) {
    // Show the update fields and hide the add fields
    document.querySelector('.input-card').style.display = "none";
    document.querySelector('.update-card').style.display = "block";

    let incomeToEdit = allIncomes[index];

    // Populate the edit fields with the selected income data
    document.querySelector('#editId').value = incomeToEdit.Id;
    document.querySelector('#editIncome').value = incomeToEdit.Income;
    document.querySelector('#editDesc').value = incomeToEdit.IncomeDesc;
    document.querySelector('#editDate').value = incomeToEdit.Date;
    
    // Store the index globally for updating later
    window.editIndex = index;
};

function updateIncomes() {
    // Retrieve the updated values from the form
    let editId = document.querySelector('#editId').value;
    let editIncome = document.querySelector('#editIncome').value;
    let editDesc = document.querySelector('#editDesc').value;
    let editDate = document.querySelector('#editDate').value;

    // Check if the income with this Id exists
    let index = allIncomes.findIndex(d => d.Id === editId);
    if (index !== -1) { allIncomes[index] = {
            Id: editId,
            Income: editIncome,
            IncomeDesc: editDesc,
            Date: editDate
        };

        // Update the local storage
        localStorage.setItem('allIncomes', JSON.stringify(allIncomes));

        // Display updated incomes
        displayIncomes();

        // Reset the form display
        document.querySelector('.input-card').style.display = "block";
        document.querySelector('.update-card').style.display = "none";
    } else {
        alert("Error: Income not found.");
    }
};

function deleteBook(index) {
    const incomeId = allIncomes[index].Id; 

    console.log('the is is', incomeId)
    allIncomes.splice(index, 1);

    allExpenses = allExpenses.filter(expense => expense.incomeId !== incomeId);


    localStorage.setItem('allIncomes', JSON.stringify(allIncomes));
    localStorage.setItem('allExpenses', JSON.stringify(allExpenses));

    console.log("Updated allIncomes:", allIncomes);
    console.log("Updated allExpenses (after delete):", allExpenses);

    displayIncomes();
};


