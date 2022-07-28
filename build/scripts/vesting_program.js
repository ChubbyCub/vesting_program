"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
const csvParser_1 = require("../libs/csvParser");
const model_1 = require("../libs/model");
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
        for (let [key, vestingSchedule] of dictionary) {
            const closestShareTracker = vestingSchedule.findClosestShareTrackerToDate(new Date(targetDate));
            if (closestShareTracker) {
                result.push(key + "," + closestShareTracker.cumulativeNumShares.toString());
            }
            else {
                result.push(key + "," + "0");
            }
        }
        // sort the result by employee Id and award Id
        result.sort((a, b) => {
            const arrayOne = a.split(",");
            const arrayTwo = b.split(",");
            return arrayOne[model_1.SortAttribute.EMPLOYEE_ID].localeCompare(arrayTwo[model_1.SortAttribute.EMPLOYEE_ID])
                || arrayOne[model_1.SortAttribute.AWARD_ID].localeCompare(arrayTwo[model_1.SortAttribute.AWARD_ID]);
        });
        result.forEach(item => {
            process.stdout.write(item + '\n');
        });
        process.exit(0);
    });
};
exports.handler = handler;
