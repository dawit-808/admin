import axios from axios;


const api = axios.create({
  baseUrl: "// baseurl from backend server" || "https://localhost/5500"
})

export default api