import { Router, Request, Response } from 'express';

import TransactionsRepository from "../repositories/TransactionsRepository"
import { getCustomRepository } from 'typeorm';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import multer from "multer";
import uploadConfig from "../config/upload";
import TransactionController from "../controllers/transactions.controller";
import { NextFunction } from 'express-serve-static-core';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await (await transactionsRepository.find()).map(item => {
    item.value = Number(item.value);
    return item
  });

  const balance = await transactionsRepository.getBalance();
  const result = {
    transactions: transactions,
    balance: balance
  }

  return response.json(result);
});

transactionsRouter.post('/', async (request: Request, response: Response, next: NextFunction) => {
  const transaction = await TransactionController.create(request, response, next);
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  let { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService;
  await deleteTransactionService.execute({ id });

  return response.status(201).json();
});

transactionsRouter.post('/import', upload.single('file'), async (request: Request, response: Response, next: NextFunction) => {
  const importTransactionService = new ImportTransactionsService;

  const filename: string = request.file.filename;
  const transactions = await importTransactionService.execute({ filename });

  for (let x = 0; x < transactions.length; x++) {
    const transaction = transactions[x];
    request.body = transaction;
    await TransactionController.create(request, response, next);
  }

  return response.json({});
});

export default transactionsRouter;
