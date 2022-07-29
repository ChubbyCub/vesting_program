import { ShareTracker } from "./model";

export default class VestingSchedule {
  private shareTrackers: Array<ShareTracker>;

  public constructor() {
    this.shareTrackers = [];
  }

  public getShareTrackers(): Array<ShareTracker> {
    return this.shareTrackers;
  }

  /**
   * Inserts a new share tracker into the vesting schedule and calculates the cumulative shares
   * at the same time.
   * @param tracker The new share tracker to be inserted into the Vesting Schedule
   * @returns updated vesting schedule
   */
  public insert(tracker: ShareTracker): Array<ShareTracker> {
    let positionToInsert = this.findInsertPosition(tracker);
    if (positionToInsert === -1) positionToInsert = 0;
    if (this.isDuplicateTracker(positionToInsert, tracker)) {
      this.shareTrackers[positionToInsert].numShares += tracker.numShares;
    } else {
      this.shareTrackers.splice(positionToInsert, 0, tracker);
    }
    
    this.calculateCumulativeShares(positionToInsert);
    return this.shareTrackers;
  }

  private isDuplicateTracker(positionToInsert: number, tracker: ShareTracker): boolean {
    if (this.shareTrackers.length === 0 && positionToInsert === 0) return false;
    if (positionToInsert > this.shareTrackers.length - 1) return false;
    if (this.shareTrackers[positionToInsert].label.getTime() === tracker.label.getTime()) return true;
    return false;
  }

  /**
   * Finds a ShareTracker with date label on or immediately before a query date.
   * @param date query.
   */
  public findClosestShareTrackerToDate(date: Date): ShareTracker | null {
    const shareTrackersSize = this.shareTrackers.length;

    if (date > this.shareTrackers[shareTrackersSize - 1].label) {
      return this.shareTrackers[shareTrackersSize - 1];
    }

    let candidateTracker = null;
    let start = 0;
    let end = shareTrackersSize - 1;

    while (start <= end) {
      let middle = Math.floor((start + end) / 2);

      const currTimeDiff = this.shareTrackers[middle].label.getTime() - date.getTime();

      if (currTimeDiff === 0) {
        return this.shareTrackers[middle];
      } else if (currTimeDiff < 0) {
        candidateTracker = this.shareTrackers[middle];
        start = middle + 1;
      } else {
        end = middle - 1;
      }
    }
    
    return candidateTracker;
  }

  private calculateCumulativeShares(insertPosition: number) {
    for (let i = insertPosition; i < this.shareTrackers.length; i += 1) {
      if (i === 0) {
        this.shareTrackers[i].cumulativeNumShares = this.shareTrackers[i].numShares;
        continue;
      }
      this.shareTrackers[i].cumulativeNumShares = this.shareTrackers[i - 1].cumulativeNumShares
          + this.shareTrackers[i].numShares;
    }
  }

  private findInsertPosition(tracker: ShareTracker): number {
    const shareTrackersSize = this.shareTrackers.length;

    if (shareTrackersSize === 0 || tracker.label < this.shareTrackers[0].label) {
      return 0;
    }

    if (tracker.label > this.shareTrackers[shareTrackersSize - 1].label) {
      return shareTrackersSize;
    }

    let start = 0;
    let end = shareTrackersSize - 1;
    let candidatePosition = -1;
    let smallestTimeDiff = Number.MAX_VALUE;

    while (start <= end) {
      let middle = Math.floor((start + end) / 2);

      const currTimeDiff = this.shareTrackers[middle].label.getTime() - tracker.label.getTime();

      if (Math.abs(currTimeDiff) < smallestTimeDiff) {
        smallestTimeDiff = Math.abs(currTimeDiff);
        if (currTimeDiff < 0) {
          candidatePosition = middle + 1;
        }
        if (currTimeDiff > 0) {
          candidatePosition = middle;
        }
      }
      if (this.shareTrackers[middle].label < tracker.label) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
    }

    return candidatePosition;
  }
}