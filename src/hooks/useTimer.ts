import { useState, useEffect } from 'react'

const formatSecondsToMinutes = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
  const seconds = totalSeconds % 60
  const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds

  return `${paddedMinutes}:${paddedSeconds}`
}

export const useTimer = (): [string, () => void, () => void, () => void] => {
  const [timerRunning, setTimerRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [formattedTime, setFormattedTime] = useState('00:00')

  useEffect(() => {
    setFormattedTime(formatSecondsToMinutes(time))
  }, [time])

  useEffect(() => {
    if (timerRunning) {
      setTimeout(() => {
        setTime(time + 1)
      }, 1000)
    }
  }, [time, timerRunning])

  const startTimer = () => setTimerRunning(true)
  const stopTimer = () => setTimerRunning(false)
  const resetTimer = () => setTime(0)

  return [formattedTime, startTimer, stopTimer, resetTimer]
}
