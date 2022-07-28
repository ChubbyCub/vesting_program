import type { Arguments, CommandBuilder } from 'yargs';
import { parse } from '../libs/csvParser';
import { Options, SortAttribute } from '../libs/model';
import VestingSchedule from '../libs/vestingSchedule';


export const command: string = '$0 <fileName> <targetDate>';
export const desc: string = 'Processing vesting schedule with vesting_program';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .positional('fileName', { type: 'string', demandOption: true })
    .positional('targetDate', { type: 'string', demandOption: true });

export const handler = (argv: Arguments<Options>) => {
  const { fileName, targetDate } = argv;
  parse(fileName, (dictionary: Map<String, VestingSchedule>) => {
    let result: string[] = [];

    for(let [key, vestingSchedule] of dictionary) {
      const closestShareTracker = vestingSchedule.findClosestShareTrackerToDate(new Date(targetDate));
      
      if (closestShareTracker) {
        result.push(key + "," + closestShareTracker.cumulativeNumShares.toString());
      } else {
        result.push(key + "," + "0");
      }
    }
    // sort the result by employee Id and award Id
    result.sort((a: string, b: string) => {
      const arrayOne = a.split(",");
      const arrayTwo = b.split(",");
      
      return arrayOne[SortAttribute.EMPLOYEE_ID].localeCompare(arrayTwo[SortAttribute.EMPLOYEE_ID]) 
        || arrayOne[SortAttribute.AWARD_ID].localeCompare(arrayTwo[SortAttribute.AWARD_ID]);
    });

    result.forEach(item => {
      process.stdout.write(item + '\n');
    });
    
    process.exit(0);
  })
};