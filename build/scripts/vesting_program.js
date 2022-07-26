"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
const csvParser_1 = require("../libs/csvParser");
exports.command = '$0 <fileName> <targetDate>';
exports.desc = 'Processing vesting schedule with vesting_program';
const builder = (yargs) => yargs
    .positional('fileName', { type: 'string', demandOption: true })
    .positional('targetDate', { type: 'string', demandOption: true });
exports.builder = builder;
const handler = (argv) => {
    const { fileName, targetDate } = argv;
    (0, csvParser_1.parse)(fileName, (dictionary) => {
        let result = [];
        for (let [key, bst] of dictionary) {
            const root = bst.getRoot();
            const closestNode = bst.findClosestNode(root, new Date(targetDate));
            if (closestNode) {
                result.push(key + "," + closestNode.numShares.toString());
            }
            else {
                result.push(key + "," + "0");
            }
        }
        result.sort((a, b) => {
            const arrayOne = a.split(",");
            const arrayTwo = b.split(",");
            if (arrayOne[0] === arrayTwo[0]) {
                return arrayOne[2].localeCompare(arrayTwo[2]);
            }
            return arrayOne[0].localeCompare(arrayTwo[0]);
        });
        process.stdout.write(JSON.stringify(result));
        process.exit(0);
    });
};
exports.handler = handler;
