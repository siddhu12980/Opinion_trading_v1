
import { WebSocket } from "ws";

let socket: WebSocket | null = null;

export async function connectWs(url: string) {
  try {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("Already connected to WebSocket");
      return;
    }

    socket = new WebSocket(url);

    socket.on("open", () => {
      console.log("WebSocket connection established");

      let msg = {
        message: (`Hello from express`)
      }
      socket?.send(JSON.stringify(msg));
    });

    socket.on("message", (message) => {
      console.log("Message received in Express:", message.toString());
    });

    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    socket.on("close", (event) => {
      console.log("WebSocket connection closed:", event);
      reconnectWs(url);
    });
  } catch (err) {
    console.error("Error establishing WebSocket connection:", err);
  }
}

export function reconnectWs(url: string) {
  console.log("Attempting to reconnect WebSocket...");
  setTimeout(() => connectWs(url), 1000);
}

export { socket };
