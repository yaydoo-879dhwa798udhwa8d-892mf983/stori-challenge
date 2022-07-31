import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

import { Account } from "./";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  transaction: string;

  @ManyToOne(() => Account, (user) => user.transactions)
  account: Account;
}
