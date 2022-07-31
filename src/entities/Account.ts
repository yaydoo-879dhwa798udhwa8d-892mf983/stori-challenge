import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from "typeorm";

import { Transaction } from "./";

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  email: string;

  @OneToMany((type) => Transaction, (tx) => tx.id)
  transactions: Transaction[];
}
