import { insert } from "../libs/binarySearchTree";
import { TreeNode } from "../libs/model";

describe('BinarySearchTree operation', () => {
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
  })
})

