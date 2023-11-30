import axios from "axios";

const replayAPI = axios.create();

replayAPI.defaults.baseURL = "https://replay-api-j3wg.onrender.com";
// replayAPI.defaults.baseURL = "http://localhost:3000";

export default replayAPI;
