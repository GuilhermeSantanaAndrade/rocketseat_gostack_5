import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = transactions.filter(item => item.type === 'income').reduce((sum, item) => sum + Number(item.value), 0);
    const outcome = transactions.filter(item => item.type === 'outcome').reduce((sum, item) => sum + Number(item.value), 0);
    return {
      income: income,
      outcome: outcome,
      total: income - outcome
    } as Balance;
  }
}

export default TransactionsRepository;
