import axios from "../api/axios";

export const registerDriver = (data) =>
  axios.post("/drivers/register", data);
