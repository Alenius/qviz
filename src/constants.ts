export enum WINDOW_SIZES {
  xs = 480,
  sm = 576,
  md = 768,
  lg = 992,
  xl = 1200,
  xxl = 1600,
}

interface ReturnObjectType {
  [key: string]: string
}

export const WINDOW_SIZES_PX: ReturnObjectType = Object.entries(WINDOW_SIZES).reduce((acc, keyValuePair) => {
  const [key, value]: [string, WINDOW_SIZES] = keyValuePair as [string, WINDOW_SIZES]
  return { ...acc, [key]: `${value}px` }
}, {} as ReturnObjectType)

export const publicUrl = 'https://qviz-be.herokuapp.com'
