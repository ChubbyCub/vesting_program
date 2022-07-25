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
        process.stdout.write(JSON.stringify(dictionary));
        process.exit(0);
    });
};
exports.handler = handler;
