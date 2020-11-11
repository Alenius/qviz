import { useState, useEffect } from 'react'
import { WINDOW_SIZES } from '../constants'

export const useWindowWidth = () => {
  const [size, setSize] = useState<number>(0)
  const [isSm, setIsSm] = useState(false)
  const [isMd, setIsMd] = useState(false)
  const [isLg, setIsLg] = useState(false)

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
      setIsLg(false)
    }
    if (size <= WINDOW_SIZES.md) {
      setIsSm(false)
      setIsMd(true)
      setIsLg(false)
    }
    if (size <= WINDOW_SIZES.lg) {
      setIsSm(false)
      setIsMd(false)
      setIsLg(true)
    }
  }, [size])

  return [isSm, isMd, isLg]
}
