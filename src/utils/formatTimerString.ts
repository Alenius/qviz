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
