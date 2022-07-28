import csv from 'csv-parser';
import fs from 'fs';
import { ShareTracker } from './model';
import { AwardAction, CsvHeaders } from './model';
import VestingSchedule from './vestingSchedule';

/**
 * Parses the csv line by line and stores the vesting information.
 * @param fileName name of the csv file to be parsed.
 * @param callback allows the function to async returns the result dictionary after it completes
 * parsing.
 */
export const parse = (fileName: string, callback: (dictionary: Map<String, VestingSchedule>) => void): void => {
  const dictionary: Map<String, VestingSchedule> = new Map<String, VestingSchedule>();
  
  fs.createReadStream(`${fileName}`)
  .pipe(csv({ headers: false }))
  .on('data', (data) => {
    const token: string = createDictionaryToken(data);
    const shareTracker: ShareTracker = buildShareTracker(data);
    buildDictionary(dictionary, token, shareTracker);
  })
  .on('end', () => {
    callback(dictionary);
  });
}


const buildShareTracker = (data: any): ShareTracker => {
  const newShareTracker: ShareTracker = {
    label: new Date(data[CsvHeaders.DATE]),
    numShares: data[CsvHeaders.ACTION] === AwardAction.VEST ? 
      parseInt(data[CsvHeaders.QUANTITY]) : -parseInt(data[CsvHeaders.QUANTITY]),
    cumulativeNumShares: 0,
  }
  return newShareTracker;
}

const createDictionaryToken = (data: any) => {
  return data[CsvHeaders.EMPLOYEE_ID] + "," 
    + data[CsvHeaders.EMPLOYEE_NAME] + "," + data[CsvHeaders.AWARD_ID];
}

const buildDictionary = (dictionary: Map<String, VestingSchedule>, token: string, tracker: ShareTracker): Map<String, VestingSchedule> => {    
  if (dictionary.has(token)) {
    const vestingSchedule = dictionary.get(token);
    vestingSchedule?.insert(tracker);
  } else {
    const vestingSchedule: VestingSchedule = new VestingSchedule();
    vestingSchedule.insert(tracker);
    dictionary.set(token, vestingSchedule);
  }

  return dictionary;
}