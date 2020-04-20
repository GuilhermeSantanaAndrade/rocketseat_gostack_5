import Transaction from '../models/Transaction';
import Category from "../models/Category";
import { getRepository, getCustomRepository } from "typeorm";
import TransactionsRepository from "../repositories/TransactionsRepository"
import AppError from '../errors/AppError';

interface Request {
  title: string,
  value: number,
  type: 'income' | 'outcome',
  desc_category: string
}

class CreateTransactionService {
  public async execute({ title, value, type, desc_category }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const balance = await transactionRepository.getBalance();
      if (balance.total < value) {
        throw new AppError('insufficient funds');
      }
    }

    const foundCategory: Category | undefined = await categoryRepository.findOne({
      where: {
        title: desc_category
      }
    })

    let id_category = undefined;
    if (foundCategory) {
      id_category = foundCategory.id
    } else {
      const category = categoryRepository.create({
        title: desc_category
      });
      const insertedCategory = await categoryRepository.save(category);
      id_category = insertedCategory.id;
    }

    const transaction = transactionRepository.create({
      title: title,
      type: type,
      value: value,
      category_id: id_category
    });

    const insertedTransaction = await transactionRepository.save(transaction);

    return insertedTransaction
  }
}

export default CreateTransactionService;
