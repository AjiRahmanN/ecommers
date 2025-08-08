import axios from 'axios'

const api = axios.create({
  baseURL: 'http://13.211.55.73:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
