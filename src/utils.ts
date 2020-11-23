import { isEmpty } from 'ramda'
import { publicUrl } from './constants'
export const getApiURL = (port = 4000) => {
  const localhostUrl = `http://localhost:${port}`
  if (process.env.NODE_ENV === 'development') {
    return localhostUrl
  } else {
    return publicUrl
  }
}

const format = (time: number) => {
  if (time === 0) return `00`
  else {
    return time < 10 ? `0${time}` : `${time}`
  }
}

export const formatTimerString = (timeInSeconds: number) => {
  const numberOfMinutes = Math.trunc(timeInSeconds / 60)
  const numberOfSeconds = timeInSeconds % 60

  const timeString = `${numberOfMinutes}:${format(numberOfSeconds)}`
  return timeString
}

export const toCamel = (s: string): string => {
  if (!s) return ''
  s = s[0].toLocaleLowerCase() + s.slice(1)
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace(/[-_]/, '')
  })
}

export const camelizeKeys = <T, R>(objectToCamelize: T[]) => {
  if (isEmpty(objectToCamelize)) return []

  return (objectToCamelize.map((unformattedQuestion) => {
    // map over entries in the question entity
    return Object.entries(unformattedQuestion).reduce((acc, [key, value]) => {
      return { ...acc, [toCamel(key)]: value }
    }, {})
  }) as unknown) as R[] // TODO: this can probably be done nicer
}
