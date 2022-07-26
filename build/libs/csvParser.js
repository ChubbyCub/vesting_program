"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const binarySearchTree_1 = __importDefault(require("./binarySearchTree"));
const model_1 = require("./model");
/**
 * Parses the csv line by line and inserts each line into a binary search tree.
 * At the same time, indexing the information about the employeeId, employeeName and awardId
 * in a dictionary to make look up more convenient
 * @param fileName name of the csv file to be parsed.
 * @param callback allows the function to async returns the result dictionary after it completes
 * parsing.
 */
const parse = (fileName, callback) => {
    const dictionary = new Map();
    fs_1.default.createReadStream(`${fileName}`)
        .pipe((0, csv_parser_1.default)({ headers: false }))
        .on('data', (data) => {
        const token = createDictionaryToken(data);
        const newNode = buildTreeNode(data);
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
};
exports.parse = parse;
const buildTreeNode = (data) => {
    const newNode = {
        label: new Date(data[model_1.CsvHeaders.DATE]),
        numShares: data[model_1.CsvHeaders.ACTION] === model_1.AwardAction.VEST ?
            parseInt(data[model_1.CsvHeaders.QUANTITY]) : -parseInt(data[model_1.CsvHeaders.QUANTITY]),
        left: null,
        right: null,
    };
    return newNode;
};
const createDictionaryToken = (data) => {
    return data[model_1.CsvHeaders.EMPLOYEE_ID] + ","
        + data[model_1.CsvHeaders.EMPLOYEE_NAME] + "," + data[model_1.CsvHeaders.AWARD_ID];
};
const buildDictionary = (dictionary, token, newNode) => {
    const employeeBst = new binarySearchTree_1.default();
    if (dictionary.has(token)) {
        const root = dictionary.get(token)?.getRoot();
        employeeBst.insert(root, newNode);
    }
    else {
        employeeBst.setRoot(newNode);
        dictionary.set(token, employeeBst);
    }
    return dictionary;
};
