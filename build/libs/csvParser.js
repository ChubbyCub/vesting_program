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
const dictionary = new Map();
/**
 * Parses the csv line by line and inserts each line into a binary search tree.
 * At the same time, indexing the information about the employeeId, employeeName and awardId
 * in a dictionary to make look up
 * @param fileName
 * @param callback
 */
const parse = (fileName, callback) => {
    fs_1.default.createReadStream(`${fileName}`)
        .pipe((0, csv_parser_1.default)({ headers: false }))
        .on('data', (data) => {
        const token = data["1"] + data["2"] + data["3"];
        const newNode = {
            label: new Date(data["4"]),
            numShares: data["0"] === model_1.AwardAction.VEST ? parseInt(data["5"]) : -parseInt(data["5"]),
            left: null,
            right: null,
        };
        const employeeBst = new binarySearchTree_1.default();
        if (dictionary.has(token)) {
            const root = dictionary.get(token)?.getRoot();
            employeeBst.insert(root, newNode);
        }
        else {
            employeeBst.setRoot(newNode);
            dictionary.set(token, employeeBst);
        }
    })
        .on('end', () => {
        // after the dictionary had all the keys, update the whole map
        // so the number of shares in each employee BST becomes accummulative sums
        for (const bst of dictionary.values()) {
            const treeRoot = bst.getRoot();
            bst.updateCumulativeShares(treeRoot);
        }
        console.log('on end: ', dictionary);
        callback(dictionary);
    });
};
exports.parse = parse;
