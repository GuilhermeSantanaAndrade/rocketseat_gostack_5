import AppError from '../errors/AppError';
import { getCustomRepository } from "typeorm";
import TransactionsRepository from "../repositories/TransactionsRepository"

interface Request {
  id: string
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    try {
      const transactionRepository = getCustomRepository(TransactionsRepository);

      await transactionRepository.delete({
        id: id
      });
    } catch (err) {
      throw err;
    }
  }
}

export default DeleteTransactionService;
