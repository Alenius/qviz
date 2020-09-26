export const WINDOW_SIZES = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
}

export const WINDOW_SIZES_PX = Object.entries(WINDOW_SIZES).reduce(
  (acc, keyValuePair) => {
    const [key, value] = keyValuePair
    return { ...acc, [key]: `${value}px` }
  },
  {}
)
