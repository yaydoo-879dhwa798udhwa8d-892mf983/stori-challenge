import { Repository } from "./";
import { DataSource } from "typeorm";
import { Account, Transaction } from "../entities";
import { getRandomFloat } from "../utils";
import { randomInt } from "crypto";

class TransactionRepository extends Repository {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }
  findByAccount = async (account: Account): Promise<Transaction[]> => {
    return await this.dataSource.manager.getRepository(Transaction).findBy({
      account: account,
    });
  };

  deleteAccountTransactions = async (account: Account) => {
    return await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(Transaction)
      .where("accountId = :id", { id: account.id })
      .execute();
  };

  insertTransaction = async (
    transaction: Transaction
  ): Promise<Transaction> => {
    const newTx = await this.dataSource.manager.save(transaction);
    return newTx;
  };

  insertRandomTxsByAccount = async (
    account: Account
  ): Promise<Transaction[]> => {
    // Create Random Transactions between 100-1k tx´s
    const numberOfTransactions = getRandomFloat(100, 1000, 0);

    for (let i = 0; i < numberOfTransactions; i++) {
      const newTx = new Transaction();
      const debitOrCredit = randomInt(2) ? `+` : `-`;
      newTx.transaction = `${debitOrCredit}${getRandomFloat(100, 1500, 2)}`;
      newTx.date = `${randomInt(12)}/${randomInt(30)}`;
      newTx.account = account;
      await this.insertTransaction(newTx);
    }
    return await this.dataSource.manager.getRepository(Transaction).findBy({
      account: account,
    });
  };
}

export { TransactionRepository };
