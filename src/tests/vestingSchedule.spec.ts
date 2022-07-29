import { ShareTracker } from "../libs/model";
import VestingSchedule from "../libs/vestingSchedule"

describe('Vesting Schedule', () => {
  let vestingSchedule: VestingSchedule;

  beforeEach(() => {
    vestingSchedule = new VestingSchedule();
  });

  it('successfully inserts share trackers in correct position and calculate correct cumulative shares', () => {
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
    // insert something with date label before the first element again
    vestingSchedule.insert(shareTracker_seven);

    expect(vestingSchedule.getShareTrackers().length).toEqual(7);
    expect(vestingSchedule.getShareTrackers()[0]).toStrictEqual({...shareTracker_seven, cumulativeNumShares: 45});
    expect(vestingSchedule.getShareTrackers()[1]).toStrictEqual({...shareTracker_three, cumulativeNumShares: 445});
    expect(vestingSchedule.getShareTrackers()[2]).toStrictEqual({...shareTracker_one, cumulativeNumShares: 645});
    expect(vestingSchedule.getShareTrackers()[3]).toStrictEqual({...shareTracker_four, cumulativeNumShares: 695});
    expect(vestingSchedule.getShareTrackers()[4]).toStrictEqual({...shareTracker_two, cumulativeNumShares: 795});
    expect(vestingSchedule.getShareTrackers()[5]).toStrictEqual({...shareTracker_six, cumulativeNumShares: 865});
    expect(vestingSchedule.getShareTrackers()[6]).toStrictEqual({...shareTracker_five, cumulativeNumShares: 910});
  });

  it('handles duplicate record insertion correctly', () => {
    const shareTracker_one: ShareTracker = {
      label: new Date('2022-07-30'),
      numShares: 200,
      cumulativeNumShares: 0,
    };
    const shareTracker_two: ShareTracker = {
      label: new Date('2022-08-01'),
      numShares: 100,
      cumulativeNumShares: 0,
    };
    const shareTracker_three: ShareTracker = {
      label: new Date('2022-08-01'),
      numShares: 100,
      cumulativeNumShares: 0,
    };
    const shareTracker_four: ShareTracker = {
      label: new Date('2022-07-30'),
      numShares: 200,
      cumulativeNumShares: 0,
    }

    vestingSchedule.insert(shareTracker_one);
    vestingSchedule.insert(shareTracker_two);
    vestingSchedule.insert(shareTracker_three);
    vestingSchedule.insert(shareTracker_four);

    expect(vestingSchedule.getShareTrackers().length).toEqual(2);
    expect(vestingSchedule.getShareTrackers()[0]).toStrictEqual({...shareTracker_one, cumulativeNumShares: 400});
    expect(vestingSchedule.getShareTrackers()[1]).toStrictEqual( {...shareTracker_two, cumulativeNumShares: 600});
  });

  it('finds the share tracker with label on or before a query date', () => {
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

    vestingSchedule.insert(shareTracker_one);
    vestingSchedule.insert(shareTracker_two);
    vestingSchedule.insert(shareTracker_three);
    vestingSchedule.insert(shareTracker_four);
    vestingSchedule.insert(shareTracker_five);

    // a date less than the smallest date on the trackers
    const result_one = vestingSchedule.findClosestShareTrackerToDate(new Date('2022-04-01'));
    // a date equal to an existing date on the trackers
    const result_two = vestingSchedule.findClosestShareTrackerToDate(new Date('2022-07-30'));
    // a date greater than the first tracker on the list of trackers
    const result_three = vestingSchedule.findClosestShareTrackerToDate(new Date('2022-06-02'));
    // a date between two dates on the list of trackers but with time distance closer to the larger date
    const result_four = vestingSchedule.findClosestShareTrackerToDate(new Date('2022-08-31'));
    expect(result_one).toBeNull();
    expect(result_two).toStrictEqual({...shareTracker_one, cumulativeNumShares: 600});
    expect(result_three).toStrictEqual({...shareTracker_three, cumulativeNumShares: 400});
    expect(result_four).toStrictEqual({...shareTracker_two, cumulativeNumShares: 750});
  })
})