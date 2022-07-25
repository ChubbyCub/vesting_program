"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findClosestNode = exports.updateCumulativeShares = exports.insert = void 0;
/**
 * @param root Starting node of the employee binary search tree.
 * @param node New tree node to be inserted into the binary search tree.
 * @returns Root of the updated binary search tree with the new node included.
 */
const insert = (root, node) => {
    if (root === null)
        return node;
    if (node.label > root.label) {
        root.right = (0, exports.insert)(root.right, node);
    }
    else if (node.label < root.label) {
        root.left = (0, exports.insert)(root.left, node);
    }
    else {
        // in case of duplicate record, adds the shares to the existing node
        root.numShares += node.numShares;
    }
    return root;
};
exports.insert = insert;
// variable to keep track of the previous node to accummulate the sum
let prevNode = null;
/**
 * Traverses the binary search tree and update each key date
 * with cummulated shares awarded to employee by each key date.
 */
const updateCumulativeShares = (root) => {
    if (root === null)
        return;
    (0, exports.updateCumulativeShares)(root.left);
    root.numShares = prevNode === null ? root.numShares : root.numShares + prevNode.numShares;
    prevNode = root;
    (0, exports.updateCumulativeShares)(root.right);
};
exports.updateCumulativeShares = updateCumulativeShares;
/**
 * Searches for a tree node given a date label.
 * @param root Starting node of the employee binary search tree.
 * @param label The date key to look up in the binary search tree.
 * @returns If the date label exists in the tree, returns the TreeNode with that label, else returns null.
 */
const findClosestNode = (root, label) => {
    if (root === null)
        return null;
    let closestDate = root.label;
    let closestNode = root;
    while (root !== null) {
        if (Math.abs(root.label.getTime() - label.getTime()) < Math.abs(closestDate.getTime() - label.getTime())) {
            closestDate = root.label;
            closestNode = root;
        }
        if (root.label < label) {
            root = root.right;
        }
        else {
            root = root.left;
        }
    }
    return closestNode;
};
exports.findClosestNode = findClosestNode;
