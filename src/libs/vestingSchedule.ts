import { ShareTracker } from "./model";

export default class VestingSchedule {
  private shareTrackers: Array<ShareTracker>;

  public constructor() {
    this.shareTrackers = [];
  }

  public getShareTrackers(): Array<ShareTracker> {
    return this.shareTrackers;
  }

  public insert(tracker: ShareTracker): Array<ShareTracker> {
    let positionToInsert = this.findInsertPosition(tracker);
    if (positionToInsert === -1) positionToInsert = 0;
    this.shareTrackers.splice(positionToInsert, 0, tracker);
    this.calculateCumulativeShares(positionToInsert);
    return this.shareTrackers;
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
    if (this.shareTrackers.length === 0 || tracker.label < this.shareTrackers[0].label) return 0;

    if (tracker.label > this.shareTrackers[this.shareTrackers.length - 1].label) return this.shareTrackers.length;

    let start = 0;
    let end = this.shareTrackers.length - 1;
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
      if (this.shareTrackers[middle].label.getTime() < tracker.label.getTime()) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
    }

    return candidatePosition;
  }
}