import { Request, Response, NextFunction } from 'express';

import CreateTransactionService from '../services/CreateTransactionService';

class TransactionController {
  create = async (request: Request, response: Response, _: NextFunction) => {
    let { title, value, type, category } = request.body;

    const transactionService = new CreateTransactionService;
    const transaction = await transactionService.execute({ title, value, type, desc_category: category });

    return transaction;
  }
}

export default new TransactionController;