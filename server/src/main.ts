import express from "express";

const PORT = 3000;

const app = express();

app.listen(PORT, (e) => {
  if (e) return console.error(e);

  console.log(`Listening on port ${PORT}`)
})