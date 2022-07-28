import { ShareTracker } from "../libs/model";
import VestingSchedule from "../libs/vestingSchedule"

describe('Vesting Schedule', () => {
  let vestingSchedule: VestingSchedule;

  beforeEach(() => {
    vestingSchedule = new VestingSchedule();
  });

  it('successfully inserts share trackers in correct position', () => {
    const shareTracker_one: ShareTracker = {
      label: new Date('2022-07-30'),
      numShares: 200,
      cumulativeNumShares: 0,
    };
    const shareTracker_two: ShareTracker = {
      label: new Date('2022-08-01'),
      numShares: 100,
      cumulativeNumShares: 0,
    }

    const shareTracker_three: ShareTracker = {
      label: new Date('2022-06-01'),
      numShares: 400,
      cumulativeNumShares: 0,
    }

    const shareTracker_four: ShareTracker = {
      label: new Date('2022-07-31'),
      numShares: 50,
      cumulativeNumShares: 0,
    }

    const shareTracker_five: ShareTracker = {
      label: new Date('2022-09-01'),
      numShares: 45,
      cumulativeNumShares: 0,
    }

    const shareTracker_six: ShareTracker = {
      label: new Date('2022-08-31'),
      numShares: 70,
      cumulativeNumShares: 0,
    }

    const shareTracker_seven: ShareTracker = {
      label: new Date('2022-05-30'),
      numShares: 45,
      cumulativeNumShares: 0,
    }
    // first insert
    vestingSchedule.insert(shareTracker_one);
    // insert something with larger date than previous one
    vestingSchedule.insert(shareTracker_two);
    // insert something with date label before the first insert
    vestingSchedule.insert(shareTracker_three);
    // insert something between two date labels that is closer to the immediate smaller element
    vestingSchedule.insert(shareTracker_four);
    // insert something larger than the largest date label present in the array
    vestingSchedule.insert(shareTracker_five);
    // insert something between two date labels that is closer to the immediate larger element
    vestingSchedule.insert(shareTracker_six);
    // insert something with date label before the first element
    vestingSchedule.insert(shareTracker_seven);
    expect(vestingSchedule.getShareTrackers().length).toEqual(7);
    expect(vestingSchedule.getShareTrackers()[0]).toStrictEqual({...shareTracker_seven, cumulativeNumShares: 45})
  })
})