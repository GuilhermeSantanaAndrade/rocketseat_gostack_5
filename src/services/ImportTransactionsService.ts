import Transaction from '../models/Transaction';
import path from 'path';
import fs from 'fs';
import AppError from '../errors/AppError';

function csvToArray(csv: string) {
  const rows: string[] = csv.split("\r\n");

  return rows.map((row) => {
    return row.split(",");
  });
};

function processImport(array: any[]): any[] {
  let result: any[] = [];
  let columns: string[] = [];
  let columnName = '';

  if (array.length) {
    for (let x = 0; x < array[0].length; x++) {
      columnName = array[0][x];
      columns.push(columnName.trim());
    }
  }

  let element: any[];
  for (let x = 1; x < array.length; x++) {
    element = array[x];
    let transaction: any = {};

    for (let y = 0; y < element.length; y++) {
      columnName = columns[y];
      transaction[columnName] = element[y].trim();
      if (columnName === 'value') {
        transaction[columnName] = Number(transaction[columnName]);
      }
    }

    result.push(transaction);
  }

  return result;
}

interface Request {
  filename: string
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    try {
      const text = await fs.promises.readFile(path.resolve(__dirname, '..', '..', 'tmp', filename), 'utf8');
      const arrayInfos = csvToArray(text);
      const transactions = processImport(arrayInfos);

      return transactions
    } catch (err) {
      throw new AppError(err)
    }
  }
}

export default ImportTransactionsService;
