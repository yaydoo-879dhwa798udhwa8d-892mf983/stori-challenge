import { DataSource } from "typeorm";

import { Repository } from "./";
import { Account } from "../entities";

class AccountRepository extends Repository {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  insertAccount = async (email: string): Promise<Account> => {
    const account = new Account();
    account.email = email;
    return await this.dataSource.manager.save(account);
  };
  findByEmail = async (email: string): Promise<Account[]> => {
    return await this.dataSource.manager.getRepository(Account).findBy({
      email: email,
    });
  };
}

export { AccountRepository };
