import { StatisticsTxPerYearI } from "../utils/statistics";

// Send Email
export interface EmailData {
  totalBalance: number;
  debitAverage: number;
  creditAverage: number;
  monthTransactions: StatisticsTxPerYearI[];
  email: string;
}
