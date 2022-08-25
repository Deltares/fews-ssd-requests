import {Duration} from "../response/action/duration";

const sign = "(-)?";
const year = "(?:([.,\\d]+)Y)?";
const month = "(?:([.,\\d]+)M)?";
const week = "(?:([.,\\d]+)W)?";
const day = "(?:([.,\\d]+)D)?";
const hour = "(?:([.,\\d]+)H)?";
const minute = "(?:([.,\\d]+)M)?";
const second = "(?:([.,\\d]+)S)?";
const iso8601DurationRegex = sign + "P" + year + month + week + day + "(?:T" + hour + minute + second + ")?";

/**
 * parse a duration string and return a Duration object (i.e. # years, # months, # weeks, etc.)
 */
function parseIso8601Duration(iso8601Duration: string): Duration | undefined {
    const matches = iso8601Duration.match(new RegExp(iso8601DurationRegex))
    if (matches) {
        return {
            sign: matches[1] === undefined ? '+' : '-',
            years: matches[2] === undefined ? 0 : +matches[2],
            months: matches[3] === undefined ? 0 : +matches[3],
            weeks: matches[4] === undefined ? 0 : +matches[4],
            days: matches[5] === undefined ? 0 : +matches[5],
            hours: matches[6] === undefined ? 0 : +matches[6],
            minutes: matches[7] === undefined ? 0 : +matches[7],
            seconds: matches[8] === undefined ? 0 : +matches[8]
        }
    }
}

/**
 * Convert a duration (in # seconds, # minutes, # hours, etc) to ms
 * NOTE: the returned value ignores the years & months in the duration object
 */
function durationToMillis(duration: Duration | undefined): number {
    if (!duration) return NaN
    const days = duration.weeks * 7 + duration.days;
    const hours = days * 24 + duration.hours;
    const minutes = hours * 60 + duration.minutes;
    const seconds = minutes * 60 + duration.seconds;
    const offset = +(duration.sign += '1') * seconds * 1000
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
