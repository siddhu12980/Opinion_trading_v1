import express, { Request, Response } from "express";
import routes from "./routes";
import cors from 'cors'
import { errorHandler } from "./middelware/errorHandling";
const app = express();
const httpPort = 3000;

app.use(cors())
 

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "healthy",
  });
});

app.use("/api/v1", routes);
app.use(errorHandler);



app.listen(httpPort, () => {
  console.log(`HTTP server running on port ${httpPort}`);
});

export default app;


