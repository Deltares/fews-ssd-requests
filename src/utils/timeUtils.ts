import { Duration } from '../interfaces'

const iso8601DurationRegex = /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/

function parseIso8601Duration (iso8601Duration: string): Duration | undefined {
  const matches = iso8601Duration.match(iso8601DurationRegex)
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

function durationToMillis (duration: Duration | undefined): number {
  if (!duration) return NaN
  const offset = +(duration.sign += '1') * ((duration.hours * 60 + duration.minutes) * 60 + duration.seconds) * 1000
  return offset
}

export function datesFromPeriod (period: string): Date[] {
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

