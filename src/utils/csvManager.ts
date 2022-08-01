import { Transaction } from "../entities";

const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csv = require("csv-parser");
const fs = require("fs");

interface CSVHeaderI {
  id: string;
  title: string;
}

const createCSV = async (
  header: CSVHeaderI[],
  email: string,
  data: Transaction[]
) => {
  const csvWriter = createCsvWriter({
    path: `src/data/${email}.csv`,
    header,
  });

  const formatedData = data.map((tx) => {
    return {
      id: tx.id,
      date: tx.date,
      transaction: tx.transaction,
    };
  });

  await csvWriter
    .writeRecords(formatedData, {})
    .then(() => console.log("The CSV file was written successfully"));
  return;
};
async function logChunks(readable) {
  const fileData: Transaction[] = [];

  for await (const chunk of readable) {
    let tx = new Transaction();
    tx.id = chunk?.Id;
    tx.date = chunk?.Date;
    tx.transaction = chunk?.Transaction;
    fileData.push(tx);
  }
  return fileData;
}

const readCSV = async (email: string) => {
  const accountCSVRoute = `src/data/${email}.csv`;

  const fileChunks = fs.createReadStream(accountCSVRoute).pipe(csv());
  return logChunks(fileChunks);
};

const csvExists = async (email: string) =>
  fs.existsSync(`src/data/${email}.csv`);

export { createCSV, readCSV, csvExists };
