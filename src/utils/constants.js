let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8000'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://mern-trello-api.onrender.com'
}

export const API_ROOT = apiRoot
