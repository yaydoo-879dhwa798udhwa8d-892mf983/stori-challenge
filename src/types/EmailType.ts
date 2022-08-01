import {
  StatisticsTxAvgPerMonthI,
  StatisticsTxPerYearI,
} from "../utils/statistics";

// Send Email
export interface EmailData {
  totalBalance: number;
  debitAverage: number;
  creditAverage: number;
  monthTransactions: StatisticsTxPerYearI[];
  debitMonthTransactions: StatisticsTxAvgPerMonthI[];
  creditMonthTransactions: StatisticsTxAvgPerMonthI[];
  email: string;
}
