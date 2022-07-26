export interface ShareTracker {
  label: Date;
  numShares: number;
  cumulativeNumShares: number;
}

export enum AwardAction {
  VEST = 'VEST',
  CANCEL = 'CANCEL',
}

export enum CsvHeaders {
  ACTION = "0",
  EMPLOYEE_ID = "1",
  EMPLOYEE_NAME = "2",
  AWARD_ID = "3",
  DATE = "4",
  QUANTITY = "5",
}

export enum SortAttribute {
  EMPLOYEE_ID = 0,
  AWARD_ID = 2,
}

export type Options = {
  fileName: string;
  targetDate: string;
};