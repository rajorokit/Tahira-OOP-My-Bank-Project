#! /usr/bin/env node
import inquirer from "inquirer";
export class Transaction {
    constructor(type, amount) {
        this.type = type;
        this.amount = amount;
        this.date = new Date();
    }
}
export class Customer {
    constructor(name, initialBalance) {
        this.accountNumber = Customer.accountCount++;
        this.name = name;
        this.balance = initialBalance;
        this.transactions = [new Transaction("Initial Deposit", initialBalance)];
    }
    deposit(amount) {
        this.balance += amount;
        this.transactions.push(new Transaction("Deposit", amount));
    }
    withdraw(amount) {
        this.balance -= amount;
        this.transactions.push(new Transaction("Withdraw", amount));
    }
    showTransactions() {
        this.transactions.forEach(transaction => {
            console.log(`${transaction.type}: ${transaction.amount}`);
        });
    }
}
Customer.accountCount = 1000;
const customers = [];
const mainMenu = async () => {
    const options = [
        "Create Account",
        "Check Balance",
        "Deposit",
        "Withdraw",
        "Transaction History",
        "Exit"
    ];
    const answer = await inquirer.prompt({
        type: "list",
        message: "Select an option:",
        name: "option",
        choices: options
    });
    switch (answer.option) {
        case "Create Account":
            await createAccount();
            break;
        case "Check Balance":
            await checkBalance();
            break;
        case "Deposit":
            await deposit();
            break;
        case "Withdraw":
            await withdraw();
            break;
        case "Transaction History":
            await transactionHistory();
            break;
        case "Exit":
            console.log("Thank you for using our bank services. Goodbye!");
            process.exit();
    }
};
const createAccount = async () => {
    const response = await inquirer.prompt([
        { type: "input", message: "Enter your name:", name: "name" },
        { type: "number", message: "Enter initial deposit amount:", name: "balance" }
    ]);
    const customer = new Customer(response.name, response.balance);
    customers.push(customer);
    console.log(`Account created successfully. Your account number is ${customer.accountNumber}.`);
    mainMenu();
};
const checkBalance = async () => {
    const accountNumber = await getAccountNumber();
    const customer = customers.find(c => c.accountNumber === accountNumber);
    if (customer) {
        console.log(`Your current balance is: ${customer.balance}`);
    }
    else {
        console.log("Invalid account number.");
    }
    mainMenu();
};
const deposit = async () => {
    const accountNumber = await getAccountNumber();
    const customer = customers.find(c => c.accountNumber === accountNumber);
    if (customer) {
        const amount = await getAmount("deposit");
        customer.deposit(amount);
        console.log(`Amount deposited successfully. new balance is: ${customer.balance}`);
    }
    else {
        console.log("Invalid account number.");
    }
    mainMenu();
};
const withdraw = async () => {
    const accountNumber = await getAccountNumber();
    const customer = customers.find(c => c.accountNumber === accountNumber);
    if (customer) {
        const amount = await getAmount("withdraw");
        if (customer.balance >= amount) {
            customer.withdraw(amount);
            console.log(`Amount withdrawn successfully. new balance is: ${customer.balance}`);
        }
        else {
            console.log("Insufficient funds.");
        }
    }
    else {
        console.log("Invalid account number.");
    }
    mainMenu();
};
const transactionHistory = async () => {
    const accountNumber = await getAccountNumber();
    const customer = customers.find(c => c.accountNumber === accountNumber);
    if (customer) {
        console.log("Transaction History:");
        customer.showTransactions();
    }
    else {
        console.log("Invalid account number.");
    }
    mainMenu();
};
const getAccountNumber = async () => {
    const response = await inquirer.prompt({
        type: "input",
        message: "Enter your account number:",
        name: "accountNumber"
    });
    return parseInt(response.accountNumber);
};
const getAmount = async (action) => {
    const response = await inquirer.prompt({
        type: "number",
        message: `Enter amount to ${action}:`,
        name: "amount"
    });
    return response.amount;
};
mainMenu();
