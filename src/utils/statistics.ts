import { Transaction } from "../entities";
import { TransactionTypeEnum } from "../types/TransactionTypeEnum";

interface StatisticsParsedDataI {
  transactionType: string;
  amount: number;
  month: string;
}

interface StatisticsDateI {
  month: string;
  day: string;
}

export interface StatisticsTxPerYearI {
  month: string;
  transactions: number;
}

interface StatisticsI {
  data: Transaction[];
  parsedData: StatisticsParsedDataI[];
}

class Statistics implements StatisticsI {
  data: Transaction[];
  parsedData: StatisticsParsedDataI[];

  constructor(data: Transaction[]) {
    this.data = data;
    this.parsedData = this.parseData(data);
  }

  parseDate = (date: string): StatisticsDateI => {
    let splitedDate = date.split("/");
    const month = splitedDate[0];
    const day = splitedDate[1];
    return {
      month,
      day,
    };
  };

  parseTransaction = (transaction: Transaction): StatisticsParsedDataI => {
    const amount = <number>(<unknown>transaction.transaction.slice(2, 100));
    const transactionType =
      transaction.transaction.slice(0, 1) === "+"
        ? TransactionTypeEnum.debit
        : TransactionTypeEnum.credit;
    const { month } = this.parseDate(transaction.date);
    return { transactionType, amount, month };
  };

  parseData = (data: Transaction[]): StatisticsParsedDataI[] =>
    data.map(
      (transaction): StatisticsParsedDataI => this.parseTransaction(transaction)
    );

  calculateTotalBalance = (): number => {
    let total: number = 0;
    this.parsedData.forEach((tx) => {
      total += tx.transactionType === "+" ? tx.amount : -tx.amount;
    });
    return total;
  };

  calculateAvgAmount = (
    transactionType: TransactionTypeEnum.debit | TransactionTypeEnum.credit
  ) =>
    this.parsedData
      .filter((tx) => tx.transactionType === transactionType)
      .map((transaction) => transaction.amount)
      .reduce(
        (total: any, current: any) => parseFloat(total) + parseFloat(current),
        0
      ) /
    this.parsedData.filter((tx) => tx.transactionType === transactionType)
      .length;

  calculateTxsByMonth = () => {
    let total = {};
    this.parsedData.forEach((tx) => {
      if (!total[tx.month.toString()]) total[tx.month] = tx.amount;
      total[tx.month] += 1;
    });
    return total;
  };

  getNumberTxByMonth = (month: string): number =>
    this.parsedData
      .filter((tx) => tx.month === month)
      .map((_) => 1)
      .reduce((total, current) => total + current, 0);

  getNumberTxByMonthPerYear = (): StatisticsTxPerYearI[] =>
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      .map((month) => month.toString())
      .map((month) => {
        return { month, transactions: this.getNumberTxByMonth(month) };
      });

  createCSV = () => {};
}

export { Statistics };
