import { publicUrl } from './constants'
export const getApiURL = (port = 4000) => {
  const localhostUrl = `http://localhost:${port}`
  if (process.env.REACT_APP_RUN_LOCALLY === 'true') {
    return localhostUrl
  } else {
    return publicUrl
  }
  // return isLocalhost ? localhostUrl : publicUrl
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
