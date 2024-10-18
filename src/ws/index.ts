
import { WebSocketServer, WebSocket } from 'ws';
const subscriptions: Map<string, Set<WebSocket>> = new Map();

export function startWebSocketServer(port: number) {
  const wss = new WebSocketServer({ port }, () => {
    console.log(`WebSocket server is listening on port ${port}`);
  });

  wss.on('connection', (ws: WebSocket) => {

    ws.on('message', (message: string) => {
      const data = JSON.parse(message);
      const stockSymbol = data.stockSymbol;

      // Add the client (WebSocket) to the subscription list for this stockSymbol
      if (!subscriptions.has(stockSymbol)) {
        subscriptions.set(stockSymbol, new Set());
      }

      const stockSet = subscriptions.get(stockSymbol);
      console.log(`Before adding: ${stockSymbol} has ${stockSet?.size || 0} clients`);

      stockSet?.add(ws);

      console.log(`After adding: ${stockSymbol} has ${stockSet?.size || 0} clients`);
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed for client');
      subscriptions.forEach((clients, stockSymbol) => {
        clients.delete(ws);
        if (clients.size === 0) {
          subscriptions.delete(stockSymbol);
        }
      });
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
}


export function broadcastOrderBookUpdate(stockSymbol: string, update: any) {
  console.log("inside broadcast")
  const clients = subscriptions.get(stockSymbol);
  console.log(`Broadcasting update to ${clients?.size || 0} clients for stock ${stockSymbol}`);

  if (clients) {
    clients.forEach((client) => {
      try {
        console.log("Sending update to client:", update);
        client.send(JSON.stringify(update));
      } catch (error) {
        console.error("Failed to send message to client:", error);
      }
    });
  }
}
