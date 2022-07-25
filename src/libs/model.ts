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