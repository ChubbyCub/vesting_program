"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BinarySearchTree {
    constructor() {
        /**
         * @param root Starting node of the employee binary search tree.
         * @param node New tree node to be inserted into the binary search tree.
         * @returns Root of the updated binary search tree with the new node included.
         */
        this.insert = (root, node) => {
            if (root === null)
                return node;
            if (node.label > root.label) {
                root.right = this.insert(root.right, node);
            }
            else if (node.label < root.label) {
                root.left = this.insert(root.left, node);
            }
            else {
                // in case of duplicate record, adds the shares to the existing node
                root.numShares += node.numShares;
            }
            return root;
        };
        /**
         * Traverses the binary search tree and update each key date
         * with cummulated shares awarded to employee by each key date.
         */
        this.updateCumulativeShares = (root) => {
            if (root === null)
                return;
            this.updateCumulativeShares(root.left);
            root.numShares = this.prevNode === null ? root.numShares : root.numShares + this.prevNode.numShares;
            this.prevNode = root;
            this.updateCumulativeShares(root.right);
        };
        /**
         * Searches for a tree node given a date label.
         * @param root Starting node of the employee binary search tree.
         * @param label The date key to look up in the binary search tree.
         * @returns If the date label exists in the tree, returns the TreeNode with that label, else returns null.
         */
        this.findClosestNode = (root, label) => {
            if (root === null)
                return null;
            let smallestTime = 0;
            let closestNode = null;
            while (root !== null) {
                if (root.label.getTime() > smallestTime && root.label.getTime() <= label.getTime()) {
                    smallestTime = root.label.getTime();
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
        this.root = null;
        this.prevNode = null;
    }
    setRoot(node) {
        this.root = node;
    }
    getRoot() {
        return this.root;
    }
    setPrevNode(node) {
        this.prevNode = node;
    }
    getPrevNode() {
        return this.prevNode;
    }
}
exports.default = BinarySearchTree;
