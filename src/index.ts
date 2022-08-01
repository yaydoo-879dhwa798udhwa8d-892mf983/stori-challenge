import { AppDataSource } from "./data-source";
import { Account, Transaction } from "./entities";
import { AccountRepository, TransactionRepository } from "./repositories";
import { TransactionTypeEnum } from "./types/TransactionTypeEnum";

import { isEmailValid } from "./utils";
import { Statistics } from "./utils/statistics";

import { sendEmail } from "./utils/sendEmail";
import { createCSV, csvExists, readCSV } from "./utils/csvManager";
const run = async () => {
  let accountEmail: string;
  try {
    accountEmail = process.argv.slice(2)[0];
    // Validate if email is valid
    if (!isEmailValid(accountEmail)) return; // this could return detailed error
  } catch (e) {
    console.log(e);
    return;
  }
  const appDataSource = await AppDataSource.initialize();
  console.log("Database Initialized:", appDataSource.isInitialized);
  // Verify if email exists in db
  const accountRepository = new AccountRepository(AppDataSource);
  const transactionRepository = new TransactionRepository(AppDataSource);
  let accountTransactions: Transaction[];
  let currentAccount: Account;

  /*    Create or get Account on Database    */

  /* Validate if Account exists */

  const accountExists = (await accountRepository.findByEmail(accountEmail))[0];
  console.log(accountExists);
  if (accountExists) {
    // If Account exists
    // get Account from Database
    currentAccount = accountExists;
  } else {
    // If Account doesnt exists
    // insert Account into database
    console.log("Inserting a new account into the database...");
    currentAccount = await accountRepository.insertAccount(accountEmail);
  }

  // -> Account Instance
  console.log("Account Instance", currentAccount);

  // Validate if file exists

  if (await csvExists(accountEmail)) {
    // If file exist
    // Read Data
    accountTransactions = await readCSV(accountEmail);
    // Delete Database Account Transaction Data

    await transactionRepository.deleteAccountTransactions(currentAccount);

    // Insert data into Database
    accountTransactions = accountTransactions.map((tx) => {
      tx.account = currentAccount;
      return tx;
    });
    await appDataSource.manager.save(accountTransactions);
  } else {
    // If file doesnt exists
    // Insert random Database Transactions
    accountTransactions = await transactionRepository.insertRandomTxsByAccount(
      currentAccount
    );
    // Create file
    await createCSV(
      [
        { id: "id", title: "Id" },
        { id: "date", title: "Date" },
        { id: "transaction", title: "Transaction" },
      ],
      accountEmail,
      accountTransactions
    );
  }

  // Get Transactions from Database
  accountTransactions = await transactionRepository.findByAccount(
    accountExists
  );

  const statistics = new Statistics(accountTransactions);

  const accountTotalBalance = statistics.calculateTotalBalance();

  console.log("Total Balance:", accountTotalBalance.toFixed(2));

  const debitAverage = statistics.calculateAvgAmount(TransactionTypeEnum.debit);
  console.log("Average Debit Transactions", debitAverage.toFixed(2));

  const accountCreditAverage = statistics.calculateAvgAmount(
    TransactionTypeEnum.credit
  );
  console.log("Average Credit Transactions", accountCreditAverage.toFixed(2));

  const accountTxPerMonth = statistics.getNumberTxByMonthPerYear();

  const months = {
    "0": "Jan",
    "1": "Feb",
    "2": "Mar",
    "3": "Apr",
    "4": "May",
    "5": "June",
    "6": "July",
    "7": "Aug",
    "8": "Sept",
    "9": "Oct",
    "10": "Nov",
    "11": "Dec",
  };
  console.log("Transactions per Month");
  accountTxPerMonth.forEach((accountTxs) => {
    console.log(`Month:${months[accountTxs.month]}`, accountTxs.transactions);
  });

  sendEmail({
    debitAverage,
    monthTransactions: accountTxPerMonth,
    totalBalance: accountTotalBalance,
    creditAverage: accountCreditAverage,
    email: accountEmail,
  }).catch(console.error);
  appDataSource.destroy();
  return;
};

run();
