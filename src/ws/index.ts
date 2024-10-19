
import { WebSocketServer, WebSocket } from 'ws';
import { redisPubSubManager } from '../PubSubManager/managet';

function startWebSocketServer(port: number) {
  const wss = new WebSocketServer({ port }, () => {
    console.log(`WebSocket server is listening on port ${port}`);
  });

  wss.on('connection', (ws: WebSocket) => {
    console.log("Connected")

    ws.on('message', async (data: string) => {
      try {
        console.log("Message inside ws on message");
        const parsedData = JSON.parse(data);
        console.log(parsedData);

        if (parsedData.stockSymbol) {
          await redisPubSubManager.listenForMessages(parsedData.stockSymbol, async (message) => {
            ws.send(JSON.stringify(message));
          });
        }
      } catch (e) {
        console.error("Error while sending data:", e);
      }
    });
    ws.on('close', () => {
      console.log('WebSocket connection closed for client');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
}


