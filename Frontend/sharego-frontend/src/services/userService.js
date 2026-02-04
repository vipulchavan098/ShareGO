import axios from "../api/axios";

export const loginUser = (data) =>
  axios.post("/users/login", data);

export const registerUser = (data) =>
  axios.post("/users/register", data);
