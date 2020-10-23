import _ from 'lodash'
import gravatar from 'gravatar'
import dayjs from 'dayjs'
import * as moment from 'moment'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few secs',
    ss: '%d secs',
    m: 'a min',
    mm: '%d mins',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  },
})

const cyDirRegex = /^cypress\/integration\//g

const osIconLookup = {
  win32: 'windows',
  darwin: 'apple',
  linux: 'linux',
}

export const getFormattedTimeFromNow = (time) => {
  return dayjs(time).fromNow()
}

export const durationFormatted = (durationInMs, padMinutes = true) => {
  const duration = moment.duration(durationInMs)

  const durationSecs = duration.seconds() ? `${duration.seconds()}` : ''
  const durationMins = duration.minutes() ? `${duration.minutes()}` : ''
  const durationHrs = duration.hours() ? `${duration.hours()}` : ''

  const total = _.compact([
    durationHrs,
    !!durationHrs || padMinutes ? _.padStart(durationMins, 2, '0') : durationMins,
    _.padStart(durationSecs, 2, '0'),
  ])

  const totalMinSec = total.join(':')

  if (totalMinSec === '00:00') {
    return `${duration.milliseconds()}ms`
  }

  return totalMinSec
}

export const osIcon = (osName) => {
  if (!osName) return ''

  return osIconLookup[osName] || 'desktop'
}

export const browserNameFormatted = (browserName) => {
  if (!browserName) return ''

  return _.capitalize(browserName)
}

export const browserVersionFormatted = (browserVersion) => {
  if (!browserVersion) return ''

  // looks like: '53.0.2785.143'
  return browserVersion.split('.')[0]
}

export const gravatarUrl = (email) => {
  let opts = { size: '13', default: 'mm' }

  if (!email) {
    opts.forcedefault = 'y'
  }

  return gravatar.url(email, opts, true)
}

export const getStatusIcon = (status) => {
  switch (status) {
    case 'errored':
      return 'exclamation-triangle'
    case 'failed':
      return 'exclamation-circle'
    case 'noTests':
      return 'ban'
    case 'passed':
      return 'check-circle'
    case 'running':
      return 'sync-alt fa-spin'
    case 'overLimit':
      return 'exclamation-triangle'
    case 'timedOut':
      return 'hourglass-end'
    case null:
      return 'terminal'
    default:
      return ''
  }
}

export function stripLeadingCyDirs (spec) {
  if (!spec) return null

  // remove leading 'cypress/integration' from spec
  return spec.replace(cyDirRegex, '')
}

export function stripSharedDirsFromDir2 (dir1, dir2, osName) {
  const sep = osName === 'win32' ? '\\' : '/'

  const arr1 = dir1.split(sep)
  const arr2 = dir2.split(sep)

  let found = false

  return _
  .chain(arr2)
  .transform((memo, segment, index) => {
    const segmentsFromEnd1 = arr1.slice(-(index + 1))
    const segmentsFromBeg2 = arr2.slice(0, index + 1)

    if (_.isEqual(segmentsFromBeg2, segmentsFromEnd1)) {
      return found = arr2.slice(index + 1)
    }

    if (found) {
      memo.push(...found)

      return false
    }
  })
  .join(sep)
  .value()
}
