export const getApiURL = (port = 4000) => {
  const localhostUrl = `http://localhost:${port}`
  const publicUrl = 'https://qviz-be.herokuapp.com'
  if (process.env.REACT_APP_RUN_LOCALLY === 'true') {
    return localhostUrl
  } else {
    return publicUrl
  }
  // return isLocalhost ? localhostUrl : publicUrl
}
