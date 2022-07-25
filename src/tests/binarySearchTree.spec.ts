import { findClosestNode, insert, updateCumulativeShares } from "../libs/binarySearchTree";
import { TreeNode } from "../libs/model";

describe('BinarySearchTree operation', () => {
  describe('inserts', () => {
    it('inserts a new tree node in the correct position', () => {
      const root: TreeNode = {
        label: new Date('2022-07-24'),
        numShares: 1000,
        left: null,
        right: null,
      }
  
      const node_one: TreeNode = {
        label: new Date('2022-06-30'),
        numShares: 200,
        left: null,
        right: null,
      }
  
      const node_two: TreeNode = {
        label: new Date('2022-08-31'),
        numShares: 20,
        left: null,
        right: null,
      }
  
      const expectedTree: TreeNode = {
        label: new Date('2022-07-24'),
        numShares: 1000,
        left: node_one,
        right: node_two,
      }
  
      insert(root, node_one);
      insert(root, node_two);
  
      expect(root).toStrictEqual(expectedTree);
    });
  
    it('adds shares to an existing node record when there is a duplicate row', () => {
      const node_one: TreeNode = {
        label: new Date('2022-06-30'),
        numShares: 200,
        left: null,
        right: null,
      }
  
      const node_two: TreeNode = {
        label: new Date('2022-08-31'),
        numShares: 20,
        left: null,
        right: null,
      }
  
      const duplicate_node_two: TreeNode = {
        label: new Date('2022-08-31'),
        numShares: 80,
        left: null,
        right: null,
      }
  
      const root: TreeNode = {
        label: new Date('2022-07-24'),
        numShares: 1000,
        left: null,
        right: null,
      }
  
      const expectedTree: TreeNode = {
        label: new Date('2022-07-24'),
        numShares: 1000,
        left: node_one,
        right: {
          label: new Date('2022-08-31'),
          numShares: 100,
          left: null,
          right: null,
        },
      }
  
      insert(root, node_one);
      insert(root, node_two);
      insert(root, duplicate_node_two);
      
      expect(root).toStrictEqual(expectedTree);
    });
  })
  
  describe('finds closest tree node', () => {
    it('should return the tree node with the closest date label to the search label input', () => {
      const node_three: TreeNode = {
        label: new Date('2022-07-03'),
        numShares: 100,
        left: null,
        right: null,
      }
  
      const node_four: TreeNode = {
        label: new Date('2022-05-21'),
        numShares: 500,
        left: null,
        right: null,
      }
      
      const node_one: TreeNode = {
        label: new Date('2022-06-30'),
        numShares: 200,
        left: node_four,
        right: node_three,
      }
  
      const node_two: TreeNode = {
        label: new Date('2022-08-31'),
        numShares: 20,
        left: null,
        right: null,
      }
  
      const root: TreeNode = {
        label: new Date('2022-07-24'),
        numShares: 1000,
        left: node_one,
        right: node_two,
      }
      // date is not part of the tree greater than the greatest label
      const result_one = findClosestNode(root, new Date('2022-09-01'));
      // date is part of the tree
      const result_two = findClosestNode(root, new Date('2022-07-03'));
      // date is not part of the tree less than the smallest label
      const result_three = findClosestNode(root, new Date('2022-04-01'));
      // date is between two dates that are part of the tree
      const result_four = findClosestNode(root, new Date('2022-07-15'));
      expect(result_one).toStrictEqual(node_two);
      expect(result_two).toStrictEqual(node_three);
      expect(result_three).toStrictEqual(node_four);
      expect(result_four).toStrictEqual(root);
    });
  });

  describe('updates cumulative shares', () => {
    it('should update the binary search tree to record cumulated shares at all date keys', () => {
      const node_three: TreeNode = {
        label: new Date('2022-07-03'),
        numShares: 100,
        left: null,
        right: null,
      }
  
      const node_four: TreeNode = {
        label: new Date('2022-05-21'),
        numShares: 500,
        left: null,
        right: null,
      }
      
      const node_one: TreeNode = {
        label: new Date('2022-06-30'),
        numShares: 200,
        left: node_four,
        right: node_three,
      }
  
      const node_two: TreeNode = {
        label: new Date('2022-08-31'),
        numShares: 20,
        left: null,
        right: null,
      }
  
      const root: TreeNode = {
        label: new Date('2022-07-24'),
        numShares: 1000,
        left: node_one,
        right: node_two,
      }
  
      updateCumulativeShares(root);
      expect(root.numShares).toEqual(1800);
      expect(node_one.numShares).toEqual(700);
      expect(node_two.numShares).toEqual(1820);
      expect(node_three.numShares).toEqual(800);
      expect(node_four.numShares).toEqual(500);
    });
  });  
})

