"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const model_1 = require("./model");
const vestingSchedule_1 = __importDefault(require("./vestingSchedule"));
/**
 * Parses the csv line by line and stores the vesting information.
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
        const shareTracker = buildShareTracker(data);
        buildDictionary(dictionary, token, shareTracker);
    })
        .on('end', () => {
        callback(dictionary);
    });
};
exports.parse = parse;
const buildShareTracker = (data) => {
    const newShareTracker = {
        label: new Date(data[model_1.CsvHeaders.DATE]),
        numShares: data[model_1.CsvHeaders.ACTION] === model_1.AwardAction.VEST ?
            parseInt(data[model_1.CsvHeaders.QUANTITY]) : -parseInt(data[model_1.CsvHeaders.QUANTITY]),
        cumulativeNumShares: 0,
    };
    return newShareTracker;
};
const createDictionaryToken = (data) => {
    return data[model_1.CsvHeaders.EMPLOYEE_ID] + ","
        + data[model_1.CsvHeaders.EMPLOYEE_NAME] + "," + data[model_1.CsvHeaders.AWARD_ID];
};
const buildDictionary = (dictionary, token, tracker) => {
    if (dictionary.has(token)) {
        const vestingSchedule = dictionary.get(token);
        vestingSchedule?.insert(tracker);
    }
    else {
        const vestingSchedule = new vestingSchedule_1.default();
        vestingSchedule.insert(tracker);
        dictionary.set(token, vestingSchedule);
    }
    return dictionary;
};
