import csv from 'csv-parser';
import fs from 'fs';
import ShareTracker from './shareTracker';
import { AwardAction, CsvHeaders, TreeNode } from './model';

/**
 * Parses the csv line by line and inserts each line into a binary search tree.
 * At the same time, indexing the information about the employeeId, employeeName and awardId
 * in a dictionary to make look up more convenient
 * @param fileName name of the csv file to be parsed.
 * @param callback allows the function to async returns the result dictionary after it completes
 * parsing.
 */
export const parse = (fileName: string, callback: (dictionary: Map<String, ShareTracker>) => void): void => {
  const dictionary: Map<String, ShareTracker> = new Map<String, ShareTracker>();
  
  fs.createReadStream(`${fileName}`)
  .pipe(csv({ headers: false }))
  .on('data', (data) => {
    const token: string = createDictionaryToken(data);
    const newNode: TreeNode = buildTreeNode(data);
    buildDictionary(dictionary, token, newNode);
  })
  .on('end', () => {
    // after all keys are inserted into the dictionary, update the whole map
    // so the number of shares in each employee BST becomes accummulative sums.
    for (const bst of dictionary.values()) {
      const treeRoot = bst.getRoot();
      bst.updateCumulativeShares(treeRoot);
    }
    callback(dictionary);
  });
}

const buildTreeNode = (data: any): TreeNode => {
  const newNode: TreeNode = {
    label: new Date(data[CsvHeaders.DATE]),
    numShares: data[CsvHeaders.ACTION] === AwardAction.VEST ? 
      parseInt(data[CsvHeaders.QUANTITY]) : -parseInt(data[CsvHeaders.QUANTITY]),
    left: null,
    right: null,
  };
  return newNode;
}

const createDictionaryToken = (data: any) => {
  return data[CsvHeaders.EMPLOYEE_ID] + "," 
    + data[CsvHeaders.EMPLOYEE_NAME] + "," + data[CsvHeaders.AWARD_ID];
}

const buildDictionary = (dictionary: Map<String, ShareTracker>, token: string, newNode: TreeNode): Map<String, ShareTracker> => {
  const employeeBst: ShareTracker = new ShareTracker();
    
  if (dictionary.has(token)) {
    const root = dictionary.get(token)?.getRoot();
    employeeBst.insert(root!, newNode);
  } else {
    employeeBst.setRoot(newNode);
    dictionary.set(token, employeeBst);
  }

  return dictionary;
}