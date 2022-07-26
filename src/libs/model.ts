/**
 * Binary search tree node.
 * Each node contains the date and the cumulative shares that have been vested by that date.
 * Each employee has their own Binary Search Tree to help look up the cumulative number of shares vested
 * on a specific date in log(N) time.
 */
export interface TreeNode {
  label: Date;
  numShares: number;
  left: TreeNode | null;
  right: TreeNode | null;
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