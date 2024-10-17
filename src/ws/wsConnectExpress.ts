
import { WebSocket } from "ws";

let socket: WebSocket | null = null;

export async function connectWs(url: string) {
  try {
    socket = new WebSocket(url);
    socket.onopen = () => {
      console.log("WebSocket connection established");
      if (socket) {
        socket.send("Hello from Express server!");
      }
    };
    socket.onmessage = (message) => {
      console.log("Message received in Express:", message.data);
    };
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event.reason);
      reconnectWs(url);
    };
  } catch (err) {
    console.error("Error establishing WebSocket connection:", err);
  }
}

export function reconnectWs(url: string) {
  console.log("Attempting to reconnect WebSocket...");
  connectWs(url);
}

export { socket };
