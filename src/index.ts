import { AppDataSource } from "./data-source";
import { Account, Transaction } from "./entities";
import { AccountRepository, TransactionRepository } from "./repositories";
import { TransactionTypeEnum } from "./types/TransactionTypeEnum";

import { isEmailValid } from "./utils";
import { Statistics } from "./utils/statistics";

import { sendEmail } from "./utils/sendEmail";
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
  const accountExists = (await accountRepository.findByEmail(accountEmail))[0];
  const transactionRepository = new TransactionRepository(AppDataSource);
  let accountTransactions: Transaction[];
  let currentAccount: Account;
  if (accountExists) {
    // Get Current Account Transactions
    accountTransactions = await transactionRepository.findByAccount(
      accountExists
    );
    currentAccount = accountExists;
  } else {
    console.log("Inserting a new account into the database...");
    currentAccount = await accountRepository.insertAccount(accountEmail);
    console.log(currentAccount);
    accountTransactions = await transactionRepository.insertRandomTxsByAccount(
      currentAccount
    );
  }

  console.log(accountTransactions);

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
