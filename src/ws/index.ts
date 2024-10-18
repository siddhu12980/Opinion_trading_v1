
import { WebSocketServer, WebSocket } from 'ws';

const subscriptions: Map<string, Set<WebSocket>> = new Map();

export function startWebSocketServer(port: number) {
  const wss = new WebSocketServer({ port }, () => {
    console.log(`WebSocket server is listening on port ${port}`);
  });

  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (message: string) => {

      const data = JSON.parse(message);

      if (!data) {
        console.log(data)
        throw Error("Data not Available")
      }
      console.log("data", data)
      const userId = data.userId
      const stockSymbol = data.stockSymbol


      if (!subscriptions.has(stockSymbol)) {
        subscriptions.set(stockSymbol, new Set());
      }
      subscriptions.get(stockSymbol)?.add(ws);

      console.log(`User ${userId} subscribed to ${stockSymbol}`);

    });

    ws.on('close', () => {
      subscriptions.forEach((clients, stockSymbol) => {
        clients.delete(ws);
        if (clients.size === 0) {
          subscriptions.delete(stockSymbol);
        }
      });
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
}

export function broadcastOrderBookUpdate(stockSymbol: string, update: any) {
  const clients = subscriptions.get(stockSymbol);
  if (clients) {
    clients.forEach((client) => {
      client.send(JSON.stringify(update));
    });
  }
}
