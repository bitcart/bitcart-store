export default ({ store, res, app }) => {
  if (process.server) {
    app.$axios.interceptors.response.use((response) => {
      return response
    },
    function (error) {
      const originalRequest = error.config
      if (error.response.status === 401 && originalRequest.url.endsWith('/token')) {
        return new Promise((resolve, reject) => {
          reject(error)
        })
      }
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        return app.$axios.post('/token',
          {
            'email': store.state.env.EMAIL,
            'password': store.state.env.PASSWORD
          }
        )
          .then((resp) => {
            if (resp.status === 200) {
              res.setHeader('Set-Cookie', [`access_token=${resp.data.access_token}`])
              return app.$axios(originalRequest)
            }
          })
      }
      return Promise.reject(error)
    })
  }
}
