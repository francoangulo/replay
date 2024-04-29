import axios from "axios";
import Config from "react-native-config";
import { NetworkInfo } from "react-native-network-info";

const replayAPI = axios.create();

let baseURL;

!Config.API_URL &&
  NetworkInfo.getIPV4Address().then((ipv4Address) => {
    console.log("franco IPV4 address: ", ipv4Address);

    baseURL = `http://${ipv4Address}:3000`;
    console.log("franco base url: ", JSON.stringify(baseURL, null, 4));
    replayAPI.defaults.baseURL = baseURL;
  });

Config.API_URL && (replayAPI.defaults.baseURL = Config.API_URL);

console.log(
  "franco api base url: ",
  JSON.stringify(replayAPI.defaults.baseURL, null, 4)
);

// replayAPI.defaults.baseURL = "http://192.168.0.102:3000";

console.log(
  "franco api base url: ",
  JSON.stringify(replayAPI.defaults.baseURL, null, 4)
);
export default replayAPI;
