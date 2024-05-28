import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import { selectTurns, setOwnerTurns } from "../redux/slices/turnsSlice";

export const useWebSockets = () => {
  const ws = useRef<WebSocket>();
  const { ownerTurns } = useAppSelector(selectTurns);
  const dispatch = useAppDispatch();
  const ownerTurnsRef = useRef(ownerTurns);

  // Update the ref whenever ownerTurns changes
  useEffect(() => {
    ownerTurnsRef.current = ownerTurns;
  }, [ownerTurns]);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000"); // Replace 'your-server-ip' with your server IP address or hostname
    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // Process the received message here
      if (message.type === "NEW_TURN") {
        dispatch(setOwnerTurns(ownerTurnsRef.current.concat(message.data)));
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
  }, [dispatch]);

  return { ws };
};
