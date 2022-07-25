import { TreeNode } from "./model"

export default class BinarySearchTree {
  private root: TreeNode | null;
  private prevNode: TreeNode | null;

  public constructor() {
    this.root = null;
    this.prevNode = null;
  }

  public setRoot(node: TreeNode | null): void {
    this.root = node;
  }

  public getRoot(): TreeNode | null {
    return this.root;
  }

  public setPrevNode(node: TreeNode | null): void {
    this.prevNode = node;
  }

  public getPrevNode(): TreeNode | null {
    return this.prevNode;
  }

  /**
   * @param root Starting node of the employee binary search tree.
   * @param node New tree node to be inserted into the binary search tree.
   * @returns Root of the updated binary search tree with the new node included.
   */
  public insert = (root: TreeNode | null, node: TreeNode): TreeNode => {
    if (root === null) return node;

    if (node.label > root.label) {
      root.right = this.insert(root.right, node);
    } else if (node.label < root.label) {
      root.left = this.insert(root.left, node);
    } else {
      // in case of duplicate record, adds the shares to the existing node
      root.numShares += node.numShares;
    }

    return root;
  }

  /**
   * Traverses the binary search tree and update each key date
   * with cummulated shares awarded to employee by each key date.
   */
  public updateCumulativeShares = (root: TreeNode | null): void => {
    if (root === null) return;
    this.updateCumulativeShares(root.left);
    root.numShares = this.prevNode === null ? root.numShares : root.numShares + this.prevNode.numShares;
    this.prevNode = root;
    this.updateCumulativeShares(root.right);
  }

  /**
   * Searches for a tree node given a date label.
   * @param root Starting node of the employee binary search tree.
   * @param label The date key to look up in the binary search tree.
   * @returns If the date label exists in the tree, returns the TreeNode with that label, else returns null.
   */
  public findClosestNode = (root: TreeNode | null, label: Date): TreeNode | null => {
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
}