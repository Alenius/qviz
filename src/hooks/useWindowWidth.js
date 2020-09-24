import { useState, useEffect } from 'react'
import { WINDOW_SIZES } from '../constants'

export const useWindowWidth = () => {
  const [size, setSize] = useState('')
  const [isSm, setIsSm] = useState(false)
  const [isMd, setIsMd] = useState(false)
  const [isLg, seIsLg] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setSize(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    handleResize() // for first mount
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (size <= WINDOW_SIZES.sm) {
      setIsSm(true)
      setIsMd(false)
      setIsMd(false)
    }
    if (size <= WINDOW_SIZES.md) {
      setIsSm(false)
      setIsMd(true)
      setIsMd(false)
    }
    if (size <= WINDOW_SIZES.lg) {
      setIsSm(false)
      setIsMd(false)
      setIsMd(true)
    }
  }, [size])

  return [isSm, isMd, isLg]
}
