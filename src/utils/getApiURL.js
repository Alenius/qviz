export const getApiURL = (port = 4000) => {
  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  const localhostUrl = `http://localhost:${port}`
  const publicUrl = ''
  return isLocalhost ? localhostUrl : publicUrl
}
