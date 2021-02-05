import {datesFromPeriod} from '../../src/utils';

describe("datesFromPeriod", function() {
  it("works for 1 minute period strings", function() {
    const start = "2021-01-01T08:50:00Z";
    const end = "2021-01-01T09:10:00Z";
    const period = start + "/" + end + "/PT1M";
    const dates = datesFromPeriod(period);
    // check the start and end
    expect(dates[0]).toEqual(new Date(start));
    expect(dates[dates.length - 1]).toEqual(new Date(end));
    // check the spacing between dates
    let previous = dates[0].getTime();
    for(let i=1; i<dates.length; i++) {
      const value = dates[i].getTime();
      expect(value - previous).toEqual(1000 * 60);
      previous = value;
    }
  });

  it("works for 10 minute period strings", function() {
    const start = "2021-01-01T08:50:00Z";
    const end = "2021-01-02T00:00:00Z";
    const period = start + "/" + end + "/PT10M";
    const dates = datesFromPeriod(period);
    // check the start and end
    expect(dates[0]).toEqual(new Date(start));
    expect(dates[dates.length - 1]).toEqual(new Date(end));
    // check the spacing between dates
    let previous = dates[0].getTime();
    for(let i=1; i<dates.length; i++) {
      const value = dates[i].getTime();
      expect(value - previous).toEqual(1000 * 60 * 10);
      previous = value;
    }
  });

  it("works for 1 hour period strings", function() {
    const start = "2021-01-01T08:00:00Z";
    const end = "2021-01-02T12:00:00Z";
    const period = start + "/" + end + "/PT1H";
    const dates = datesFromPeriod(period);
    // check the start and end
    expect(dates[0]).toEqual(new Date(start));
    expect(dates[dates.length - 1]).toEqual(new Date(end));
    // check the spacing between dates
    let previous = dates[0].getTime();
    for(let i=1; i<dates.length; i++) {
      const value = dates[i].getTime();
      expect(value - previous).toEqual(1000 * 60 * 60);
      previous = value;
    }
  });

  it("works for 1 day period strings", function() {
    const start = "2021-01-01T05:00:00Z";
    const end = "2021-01-10T05:00:00Z";
    const period = start + "/" + end + "/P1D";
    const dates = datesFromPeriod(period);
    // check the start and end
    expect(dates[0]).toEqual(new Date(start));
    expect(dates[dates.length - 1]).toEqual(new Date(end));
    // check the spacing between dates
    let previous = dates[0].getTime();
    for(let i=1; i<dates.length; i++) {
      const value = dates[i].getTime();
      expect(value - previous).toEqual(1000 * 60 * 60 * 24);
      previous = value;
    }
  });

  it("works for crazy period strings", function() {
    const start = "2021-01-01T00:00:00Z";
    const end = "2021-01-25T03:06:09Z";
    const period = start + "/" + end + "/P1W1DT1H2M3S";
    const dates = datesFromPeriod(period);
    // check the start and end
    expect(dates[0]).toEqual(new Date(start));
    expect(dates[dates.length - 1]).toEqual(new Date(end));
    // check the spacing between dates
    let previous = dates[0].getTime();
    const days = 8;
    const hours = days * 24 + 1;
    const minutes = hours * 60 + 2;
    const seconds = minutes * 60 + 3;
    for(let i=1; i<dates.length; i++) {
      const value = dates[i].getTime();
      expect(value - previous).toEqual(1000 * seconds);
      previous = value;
    }
  });
});
