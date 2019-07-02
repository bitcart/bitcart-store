import axios from 'axios'

export default axios.create({
  baseURL: process.env.BITCART_FRONTEND_URL,
  auth: {
    username: process.env.BITCART_FRONTEND_USER,
    password: process.env.BITCART_FRONTEND_PASS
  }
})
