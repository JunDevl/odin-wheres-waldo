import express, { Router } from "express";
import cors from "cors";
import { readFileSync } from "node:fs";

const PORT = 3000;

const app = express();

app.use(cors({
  origin: "*" // no protection at all
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiRouter = Router();

app.use("/api", apiRouter);

apiRouter.get("/image", (req, res, next) => {
  return next();
})

apiRouter.post("/image/guess", (req, res, next) => {
  return next();
})

apiRouter.get("/scores", (req, res, next) => {
  return next();
})

apiRouter.post("/scores/:userName", (req, res, next) => {
  return next();
})

app.use((err: any, _: any, res: any, __: any) => {
  console.error(err.stack);
  res.send(err.message);
})

app.listen(PORT, e => {
  if (e) return console.error(e);

  console.log(`Listening on port ${PORT}`)
})