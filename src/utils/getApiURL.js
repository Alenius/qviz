export const getApiURL = (port = 4000) => {
  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  const localhostUrl = `http://localhost:${port}`
  const publicUrl = 'https://qviz-be.herokuapp.com/'
  console.log({ process: process.env.REACT_APP_RUN_LOCALLY })
  if (process.env.REACT_APP_RUN_LOCALLY) {
    return localhostUrl
  } else {
    return publicUrl
  }
  // return isLocalhost ? localhostUrl : publicUrl
}
