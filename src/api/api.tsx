import axios from "axios";
import Config from "react-native-config";
import { NetworkInfo } from "react-native-network-info";

const replayAPI = axios.create();

// let baseURL;

// !Config.API_URL &&
//   NetworkInfo.getIPV4Address().then((ipv4Address) => {
//     baseURL = `http://${ipv4Address}:3000`;
//     replayAPI.defaults.baseURL = baseURL;
//   });

// Config.API_URL && (replayAPI.defaults.baseURL = Config.API_URL);

replayAPI.defaults.baseURL = "http://192.168.1.35:3000";

export default replayAPI;
