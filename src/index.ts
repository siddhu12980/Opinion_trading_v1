import express, { Request, Response, NextFunction } from "express";
import routes from "./routes";
import { errorHandler } from "./middelware/errorHandling";
import { reconnectWs, socket } from "./ws/wsConnectExpress";
import { startWebSocketServer } from "./ws";
const app = express();
const httpPort = 3000;
const wsPort = 8080;
if (!socket) {
  reconnectWs("ws://localhost:8080")
}

app.use(express.json());
app.get("/", (req: Request, res: Response) => {

  if (!socket) {
    reconnectWs("ws://localhost:8080")
  }
  socket?.send("From inside checking ws Health")

  res.json({
    message: "healthy",
  });
});

app.use("/api/v1", routes);
app.use(errorHandler);

startWebSocketServer(wsPort);


app.listen(httpPort, () => {
  console.log(`HTTP server running on port ${httpPort}`);
});

export default app;


