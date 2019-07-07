import axios from 'axios'

const instance = axios.create({ baseURL: process.env.BITCART_FRONTEND_URL })
instance.defaults.headers.common.Authorization = 'Token ' + process.env.BITCART_FRONTEND_TOKEN

export default instance
