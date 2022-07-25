import type { Arguments, CommandBuilder } from 'yargs';
import { parse } from '../libs/csvParser';
import { TreeNode } from '../libs/model';

type Options = {
  fileName: string;
  targetDate: string;
};

export const command: string = '$0 <fileName> <targetDate>';
export const desc: string = 'Processing vesting schedule with vesting_program';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .positional('fileName', { type: 'string', demandOption: true })
    .positional('targetDate', { type: 'string', demandOption: true });

export const handler = (argv: Arguments<Options>) => {
  const { fileName, targetDate } = argv;
  parse(fileName, (dictionary: Map<String, TreeNode>) => {
    process.stdout.write(JSON.stringify(dictionary));
    process.exit(0);
  })
};