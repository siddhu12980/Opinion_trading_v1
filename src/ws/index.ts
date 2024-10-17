
import express from 'express';
import { WebSocketServer } from 'ws';

export function startServer(port: number) {
  let subscriptions: Map<string, string[]>;
  const app = express();
  const httpServer = app.listen(port, () => {
    console.log(`Ws is listening on port ${port}`);
  });

  const wss = new WebSocketServer({ server: httpServer });

  wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data, isBinary) {
      wss.clients.forEach(function each(client) {
        if (client.readyState === ws.OPEN) {
          client.send(data, { binary: isBinary });
        }
      });
    });

    ws.on("close", () => console.log("ws closed"))

    ws.send('Hello! Message From ws side!!');
  });
}
