import { publicUrl } from './constants'
import { getApiURL, formatTimerString, toCamel } from './utils'

describe('utils', () => {
  describe('getApiUrl', () => {
    it('returns the server api', () => {
      const url = getApiURL()
      expect(url).toBe(publicUrl)
    })
  })

  describe('formatTimerString', () => {
    it('returns double zero for zero', () => {
      const time = formatTimerString(0)
      expect(time).toBe('0:00')
    })

    it('returns formatted string for time below one minute ', () => {
      const time = formatTimerString(30)
      expect(time).toBe('0:30')
    })

    it('returns formatted string for time above one minute ', () => {
      const time = formatTimerString(90)
      expect(time).toBe('1:30')
    })

    it('returns formatted string for time above ten minutes ', () => {
      const time = formatTimerString(3600 - 10)
      expect(time).toBe('59:50')
    })
  })

  describe('toCamel', () => {
    it('correctly camels snake case', () => {
      const snake = 'i_am_a_snake'
      const camel = toCamel(snake)
      expect(camel).toBe('iAmASnake')
    })

    it('correctly camels kebab case', () => {
      const kebab = 'i-am-a-kebab'
      const camel = toCamel(kebab)
      expect(camel).toBe('iAmAKebab')
    })

    it('correctly camels pascal case', () => {
      const pascal = 'CallMePascal'
      const camel = toCamel(pascal)
      expect(camel).toBe('callMePascal')
    })
  })
})
