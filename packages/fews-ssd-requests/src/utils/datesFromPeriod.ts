import { Duration } from "../response/action/duration.js";

const sign = "(-)?";
const year = String.raw`(?:([.,\d]+)Y)?`;
const month = String.raw`(?:([.,\d]+)M)?`;
const week = String.raw`(?:([.,\d]+)W)?`;
const day = String.raw`(?:([.,\d]+)D)?`;
const hour = String.raw`(?:([.,\d]+)H)?`;
const minute = String.raw`(?:([.,\d]+)M)?`;
const second = String.raw`(?:([.,\d]+)S)?`;
const dateParts = `${year}${month}${week}${day}`;
const timeParts = `(?:T${hour}${minute}${second})?`;
const iso8601DurationRegex = sign + "P" + dateParts + timeParts;

/**
 * parse a duration string and return a Duration object (i.e. # years, # months, # weeks, etc.)
 */
function parseIso8601Duration(iso8601Duration: string): Duration | undefined {
    const iso8601DurationPattern = new RegExp(iso8601DurationRegex)
    const matches = iso8601DurationPattern.exec(iso8601Duration)
    if (!matches) return undefined

    const toNumber = (value: string | undefined): number => value === undefined ? 0 : +value
    const [, parsedSign, years, months, weeks, days, hours, minutes, seconds] = matches

    return {
        sign: parsedSign === undefined ? '+' : '-',
        years: toNumber(years),
        months: toNumber(months),
        weeks: toNumber(weeks),
        days: toNumber(days),
        hours: toNumber(hours),
        minutes: toNumber(minutes),
        seconds: toNumber(seconds)
    }
}

/**
 * Convert a duration (in # seconds, # minutes, # hours, etc) to ms
 * NOTE: the returned value ignores the years & months in the duration object
 */
function durationToMillis(duration: Duration | undefined): number {
    if (!duration) return Number.NaN
    const days = duration.weeks * 7 + duration.days;
    const hours = days * 24 + duration.hours;
    const minutes = hours * 60 + duration.minutes;
    const seconds = minutes * 60 + duration.seconds;
    const offset = +(duration.sign + '1') * seconds * 1000
    return offset
}

/**
 * parse a period string and return all possible dates in the period
 */
export function datesFromPeriod(period: string): Date[] {
    const periodParts = period.split('/', 3)

    const start = new Date(periodParts[0])
    const end = new Date(periodParts[1])
    const duration = parseIso8601Duration(periodParts[2])

    const d: Date[] = [start]
    const offset = durationToMillis(duration)
    let nextDate = start.getTime() + offset
    while (nextDate < end.getTime()) {
        d.push(new Date(nextDate))
        nextDate = nextDate + offset
    }
    d.push(end)
    return d
}
