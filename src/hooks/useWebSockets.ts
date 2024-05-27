import { useEffect, useRef } from "react";
import { Alert } from "react-native";

export const useWebSockets = () => {
  const ws = useRef<WebSocket>();

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000"); // Replace 'your-server-ip' with your server IP address or hostname
    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message from server:", message);
      // Process the received message here
      if (message.type === "NEW_TURN") {
        Alert.alert("New turn", "A new turn has been scheduled!", [
          { text: "Aceptar", onPress: () => {} },
        ]);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      // Close the WebSocket connection when component unmounts
      ws?.current?.close();
    };
  }, []);

  return { ws };
};
