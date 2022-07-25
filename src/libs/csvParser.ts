import csv from 'csv-parser';
import fs from 'fs';
import { insert, updateCumulativeShares } from './binarySearchTree';
import { AwardAction, TreeNode } from './model';

const dictionary: Map<String, TreeNode> = new Map<String, TreeNode>();

/**
 * Parses the csv line by line and inserts each line into a binary search tree.
 * At the same time, indexing the information about the employeeId, employeeName and awardId
 * in a dictionary to make look up 
 * @param fileName 
 * @param callback 
 */
export const parse = (fileName: string, callback: (dictionary: Map<String, TreeNode>) => void): void => {
  fs.createReadStream(`${fileName}`)
  .pipe(csv({ headers: false }))
  .on('data', (data) => {
    const token: string = data["1"] + data["2"] + data["3"];
    
    const newNode: TreeNode = {
      label: new Date(data["4"]),
      numShares: data["0"] === AwardAction.VEST ? parseInt(data["5"]) : -parseInt(data["5"]),
      left: null,
      right: null,
    };
    
    if (dictionary.has(token)) {
      const root = dictionary.get(token);
      insert(root!, newNode);
    } else {
      const root = insert(null, newNode);
      dictionary.set(token, root);
    }
  })
  .on('end', () => {
    // after the dictionary had all the keys, update the whole map
    // so the number of shares in each employee BST becomes accummulative sums
    for (const treeRoot of dictionary.values()) {
      updateCumulativeShares(treeRoot);
    }
    console.log('on end: ', dictionary);
    callback(dictionary);
  });
}