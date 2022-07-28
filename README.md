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
 * A ShareTracker interface to keep track of the vesting date, the number of shares vested on that date
 * and the cumulative number of shares vested as of the vesting date.
 */
export interface ShareTracker {
  label: Date;
  numShares: number;
  cumulativeNumShares: number;
}

/**
 * A vesting schedule class that tracks all the vesting dates for each employee.
 */
class VestingSchedule {
  shareTrackers: Array<ShareTracker>;
}

/**
 * Builds a dictionary with key tokens equal concatenation of employeeId, employeeName, and awardId.
 * Each key token will map to a vesting schedule that stores a list of share trackers.
 */
const dictionary: Map<String, VestingSchedule> {
  key: string;
  value: VestingSchedule;
}
~~~~

##### Write operation
1. Process the csv file line by line. As a new line is read, the following transactions are performed:
  a.  Create a new key (if not already exists) in the Dictionary. The key is a string concat of `employeeId,employeeName,awardId`
  b.  In case the key exists, retrieve the vesting schedule for that employee and inserts into this vesting schedule. Otherwise, create a new vesting schedule and insert the first share tracker for that employee.
2. Note that the `insert` transaction still maintains the list order. In particular, we performed a binary search to find the insert position on the existing vesting schedule, which takes O(logN) time, in which N is the number of share trackers currently on the list.
3. Note that the cumulative shares are calculated at the insertion time to make the write operation more efficient because we are only updating the vesting schedule from the insertion point till the end, saving us some processing time.

##### Read operation

1. When given a `target date` the program will do a simple binary search of the list of share trackers for each employee and returns the share tracker with the date label on or before the `target date`. This read operation takes O(logN) time.
2. The problem requires the result output to be sorted by `employeeId` and `awardId`. This is achieved by the the custom sort function. The time complexity of this sort is positively correlated with the result output size.