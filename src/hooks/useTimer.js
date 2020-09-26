import { useState } from 'react'
import { differenceInSeconds } from 'date-fns'

export const useTimer = () => {
  const [startTime, setStartTime] = useState()
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerValue, setTimerValue] = useState(0)

  const startTimer = () => {
    const currentTime = new Date().getTime()
    setStartTime(currentTime)
    setTimerRunning(true)
  }

  const stopTimer = () => {
    if (timerRunning) {
      const currentTime = new Date().getTime()
      const timeDiff = differenceInSeconds(currentTime, startTime)
      setTimerValue(timeDiff)
      setTimerRunning(false)
    }
  }

  return [timerValue, startTimer, stopTimer]
}
