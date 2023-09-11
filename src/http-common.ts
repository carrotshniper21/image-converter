import axios from "axios";

export default axios.create({
  baseURL: "https://silent-tree-5820.fly.dev",
  headers: {
    "Content-Type": "application/json"
  }
})
