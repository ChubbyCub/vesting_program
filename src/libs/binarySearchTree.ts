import { TreeNode } from "./model"

/**
 * @param root Starting node of the employee binary search tree.
 * @param node New tree node to be inserted into the binary search tree.
 * @returns Root of the updated binary search tree with the new node included.
 */
export const insert = (root: TreeNode | null, node: TreeNode): TreeNode => {
  if (root === null) return node;

  if (node.label > root.label) {
    root.right = insert(root.right, node);
  } else if (node.label < root.label) {
    root.left = insert(root.left, node);
  } else {
    // in case of duplicate record, adds the shares to the existing node
    root.numShares += node.numShares;
  }

  return root;
}

let prevNode: TreeNode | null = null;
/**
 *  
 */
export const updateCumulativeShares = (root: TreeNode | null): void => {
  if (root === null) return;
  updateCumulativeShares(root.left);
  root.numShares = prevNode === null ? root.numShares : root.numShares + prevNode.numShares;
  prevNode = root;
  updateCumulativeShares(root.right);
}

/**
 * Searches for a tree node given a date label.
 * @param root Starting node of the employee binary search tree.
 * @param label The date key to look up in the binary search tree.
 * @returns If the date label exists in the tree, returns the TreeNode with that label, else returns null.
 */
export const findClosestNode = (root: TreeNode | null, label: Date): TreeNode | null => {
  if (root === null) return null;

  let closestDate = root.label;
  let closestNode = root;

  while (root !== null) {
    if (Math.abs(root.label.getTime() - label.getTime()) < Math.abs(closestDate.getTime() - label.getTime())) {
      closestDate = root.label;
      closestNode = root;
    }
    if (root.label < label) {
      root = root.right;
    } else {
      root = root.left;
    }
  }

  return closestNode;
}


