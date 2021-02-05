/**
 * Definition of an object that defines a duration in
 * years/months/weeks/days/hours/minutes/seconds
 */
export interface Duration {
  sign: '+'|'-';
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

