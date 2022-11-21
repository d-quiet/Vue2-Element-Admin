import axios from "axios"
const service = axios.create({
 // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // 超时时间


})
service.interceptors.request.use(
 
)
service.interceptors.response.use(
 
)
export default service