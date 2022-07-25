### INSTRUCTIONS
This is a NodeJs CLI application. To start running the program, you need to install the followings:
1. Download nodejs `https://nodejs.org/en/`.
2. Run `npm install -g npm@latest` 

Follow the steps below to get the program running:

1. Enter the `vesting_program` folder.
2. Drop your `your_filename.csv` into the root of the project folder. 
3. Run `./vesting_program <your_filename.csv> <your_target_date>`. The program should start running and output the result to the console.

### TECHNICAL DOC
As mentioned in the project intro, vesting events happen incrementally over a period of time. As a result, I assume that the `write` operation does not happen as frequently as the `read` operation.

In an actual implementation, the data in the csv file should be stored in a database (i.e. Postgresql). We can use a query language to aggregate and filter data. I am not sure the machine running this program has a database instance installed, so the data are stored in memory for now.

My program is optimized for `read` over `write` operation of the csv input file. In particular, data are first indexed based on the string concatenation of the `employeeId,employeeName,awardId`. Then data are indexed based on the `vesting_dates` to make it convenient to query for the number of shares vested on or before a `target date`.

~~~~
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

/**
 * Builds a dictionary with key tokens equal concatenation of employeeId, employeeName, and awardId.
 * Each key token will map to the root of a binary search tree that stores cumulative vested shares
 * of that employee on specific dates.
 */
export interface Dictionary {
  key: string;
  value: TreeNode;
}
~~~~

##### Write operation
1. Process the csv file line by line. As a new line is read, the following transactions are performed:
    a. Create a new key (if not already exists) in the Dictionary. The key is a string concat of `employeeId,employeeName,awardId`
    b. Create a new TreeNode with the label being the vesting date. This TreeNode will be inserted into a `BinarySearchTree`. 
2. 

##### Read operation


