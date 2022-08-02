import { AppDataSource } from "./data-source";
import { Account, Transaction } from "./entities";
import { AccountRepository, TransactionRepository } from "./repositories";
import { TransactionTypeEnum } from "./types/TransactionTypeEnum";

import { isEmailValid } from "./utils";
import {
  Statistics,
  StatisticsTxAvgPerMonthI,
  StatisticsTxPerYearI,
} from "./utils/statistics";

import { Email } from "./utils/sendEmail";
import { CSV } from "./utils/csvManager";
import { DataSource } from "typeorm";

interface MainI {
  accountEmail: string;
  dataSource: DataSource;
  accountRepository: AccountRepository;
  transactionRepository: TransactionRepository;
  csvInstance: CSV;
  emailInstance: Email;
  currentAccount: Account;
  accountTransactions: Transaction[];
  accountTotalBalance: number;
  debitAverage: number;
  debitAveragePerMonth: StatisticsTxAvgPerMonthI[];
  accountCreditAverage: number;
  creditAveragePerMonth: StatisticsTxAvgPerMonthI[];
  accountTxPerMonth: StatisticsTxPerYearI[];
}

interface MainConstructorI {
  dataSource: DataSource;
}

class Main implements MainI {
  accountEmail: string;
  dataSource: DataSource;
  accountRepository: AccountRepository;
  transactionRepository: TransactionRepository;
  csvInstance: CSV;
  emailInstance: Email;
  currentAccount: Account;
  accountTransactions: Transaction[];
  accountTotalBalance: number;
  debitAverage: number;
  debitAveragePerMonth: StatisticsTxAvgPerMonthI[] = [];
  accountCreditAverage: number;
  creditAveragePerMonth: StatisticsTxAvgPerMonthI[] = [];
  accountTxPerMonth: StatisticsTxPerYearI[];

  constructor(constructorData: MainConstructorI) {
    this.dataSource = constructorData.dataSource;
  }

  ValidateEmail = (): Boolean => {
    try {
      this.accountEmail = process.argv.slice(2)[0];
      // Validate if email is valid
      if (!isEmailValid(this.accountEmail)) return false; // this could return detailed error
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  };
  ConnectDatabase = async (): Promise<Boolean> => {
    this.dataSource = await this.dataSource.initialize();
    console.log(
      "Database Conection Initialized:",
      this.dataSource.isInitialized
    );
    return this.dataSource.isInitialized;
  };

  DisconnectDatabase = async () => {
    this.dataSource.destroy();
  };

  InitializeRepositories = () => {
    this.accountRepository = new AccountRepository(this.dataSource);
    this.transactionRepository = new TransactionRepository(this.dataSource);
  };

  InitializeClassesInstances = () => {
    this.csvInstance = new CSV();
    this.emailInstance = new Email();
  };

  GetOrCreateAccount = async () => {
    const accountExists = (
      await this.accountRepository.findByEmail(this.accountEmail)
    )[0];

    if (accountExists) {
      // If Account exists
      // get Account from Database
      this.currentAccount = accountExists;
    } else {
      // If Account doesnt exists
      // insert Account into database
      console.log("Inserting a new account into the database...");
      this.currentAccount = await this.accountRepository.insertAccount(
        this.accountEmail
      );
    }
  };

  CsvDatabaseProcess = async () => {
    if (await this.csvInstance.csvExists(this.accountEmail)) {
      // If file exist
      // Read Data
      this.accountTransactions = await this.csvInstance.readCSV(
        this.accountEmail
      );
      // Delete Database Account Transaction Data

      await this.transactionRepository.deleteAccountTransactions(
        this.currentAccount
      );

      // Insert data into Database
      this.accountTransactions = this.accountTransactions.map((tx) => {
        tx.account = this.currentAccount;
        return tx;
      });
      await this.dataSource.manager.save(this.accountTransactions);
    } else {
      // If file doesnt exists
      // Insert random Database Transactions
      this.accountTransactions =
        await this.transactionRepository.insertRandomTxsByAccount(
          this.currentAccount
        );
      // Create file
      await this.csvInstance.createCSV(
        [
          { id: "id", title: "Id" },
          { id: "date", title: "Date" },
          { id: "transaction", title: "Transaction" },
        ],
        this.accountEmail,
        this.accountTransactions
      );
    }
  };

  CalculateStatistics = async () => {
    const statisticsInstance = new Statistics(this.accountTransactions);

    this.accountTotalBalance = statisticsInstance.calculateTotalBalance();

    this.debitAverage = statisticsInstance.calculateAvgAmount(
      TransactionTypeEnum.debit
    );

    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"].forEach(
      (month) => {
        this.debitAveragePerMonth.push({
          month,
          average: statisticsInstance.getAvgTxAmountPerMonth(
            TransactionTypeEnum.debit,
            month
          ),
        });
      }
    );

    this.accountCreditAverage = statisticsInstance.calculateAvgAmount(
      TransactionTypeEnum.credit
    );

    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"].forEach(
      (month) => {
        this.creditAveragePerMonth.push({
          month,
          average: statisticsInstance.getAvgTxAmountPerMonth(
            TransactionTypeEnum.credit,
            month
          ),
        });
      }
    );

    this.accountTxPerMonth = statisticsInstance.getNumberTxByMonthPerYear();
  };

  SendEmail = () => {
    this.emailInstance
      .sendEmail({
        debitAverage: this.debitAverage,
        monthTransactions: this.accountTxPerMonth,
        totalBalance: this.accountTotalBalance,
        creditAverage: this.accountCreditAverage,
        email: this.accountEmail,
        debitMonthTransactions: this.debitAveragePerMonth,
        creditMonthTransactions: this.creditAveragePerMonth,
      })
      .catch(console.error);
  };
  Execute = async () => {
    if (!this.ValidateEmail()) return;
    if (!(await this.ConnectDatabase())) return;
    this.InitializeRepositories();
    this.InitializeClassesInstances();

    /*    Create or get Account on Database    */

    await this.GetOrCreateAccount();

    // -> Account Instance

    await this.CsvDatabaseProcess();

    // Get Transactions from Database
    this.accountTransactions = await this.transactionRepository.findByAccount(
      this.currentAccount
    );

    await this.CalculateStatistics();
    this.SendEmail();

    this.DisconnectDatabase();
    return;
  };
}

const main = new Main({
  dataSource: AppDataSource,
});

main.Execute();
