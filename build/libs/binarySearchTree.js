"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findClosestNode = exports.findMaxInLeftSubtree = exports.findMinInRightSubtree = exports.findPredecessor = exports.findSuccessor = exports.updateCumulativeShares = exports.insert = void 0;
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
let prevNode = null;
/**
 *
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
 * Finds the inorder successor of a given node in a binary search tree.
 * @param root Starting node of the employee binary search tree.
 * @param node The node that we need to find the successor of.
 * @returns The successor node of the input node.
 */
const findSuccessor = (root, node) => {
    if (root === null)
        return null;
    if (node.right !== null) {
        return (0, exports.findMinInRightSubtree)(node.right);
    }
    let prev = null;
    while (root !== null && root.label !== node.label) {
        if (root.label <= node.label) {
            root = root.right;
        }
        else {
            prev = root;
            root = root.left;
        }
    }
    return prev;
};
exports.findSuccessor = findSuccessor;
/**
 * Finds the inorder predecessor of a given node in a binary search tree.
 * @param root Starting node of the employee binary search tree.
 * @param node The node that we need to find the predecessor of.
 * @returns The predecessor node of the input node.
 */
const findPredecessor = (root, node) => {
    if (root === null)
        return null;
    if (node.left !== null) {
        return (0, exports.findMaxInLeftSubtree)(node.left);
    }
    let prev = null;
    while (root !== null && root.label !== node.label) {
        if (root.label <= node.label) {
            prev = root;
            root = root.right;
        }
        else {
            root = root.left;
        }
    }
    return prev;
};
exports.findPredecessor = findPredecessor;
const findMinInRightSubtree = (node) => {
    if (node === null)
        return null;
    while (node.left !== null) {
        node = node.left;
    }
    return node;
};
exports.findMinInRightSubtree = findMinInRightSubtree;
const findMaxInLeftSubtree = (node) => {
    if (node === null)
        return null;
    while (node.right !== null) {
        node = node.right;
    }
    return node;
};
exports.findMaxInLeftSubtree = findMaxInLeftSubtree;
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
