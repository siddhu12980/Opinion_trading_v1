import express, { Request, Response } from "express";
import routes from "./routes";
import { errorHandler } from "./middelware/errorHandling";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    "message": "healthy"
  })
})


app.use("/api/v1", routes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app
