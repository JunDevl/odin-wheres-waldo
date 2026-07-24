import express, { Router } from "express";
import type { RequestHandler } from "express";
import cors from "cors";
import { body, matchedData, validationResult, type ValidationChain } from "express-validator";
import { readFileSync } from "node:fs";
import prisma from "../lib/prisma.ts";

const PORT = 3000;

const app = express();

app.use(cors({
  origin: "*" // no protection at all
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiRouter = Router();

app.use("/api", apiRouter);

apiRouter.get("/game/init", async (_, res) => {
  const { initialTime } = await prisma.timedSession.create({});

  res.json({ init: initialTime })
})

apiRouter.get("/image", (req, res, next) => {
  return next();
})

const GUESS_PIXEL_THRESHOLD = 30;

apiRouter.post("/image/guess", [
  body("init").isDate().notEmpty(), 
  body("targetPixel.*").isNumeric().notEmpty(),
  body("characterName").trim().notEmpty(),
], ((async (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) return res.status(400).json(validationErrors.array());

  const sessionInit = req.body.init;

  const targetX: number = req.body.targetPixel.x;
  const targetY: number = req.body.targetPixel.y;

  const characterName: string = req.body.characterName;

  const guess = {
    x: targetX - GUESS_PIXEL_THRESHOLD,
    y: targetY - GUESS_PIXEL_THRESHOLD,
    width: targetX + GUESS_PIXEL_THRESHOLD,
    height: targetY + GUESS_PIXEL_THRESHOLD
  }

  const character = await prisma.imageCharacter.findFirst({
    where: { characterName }
  })

  if (!character) return res.sendStatus(404);

  const { xPos, yPos, width, height } = character;

  if (!(xPos >= guess.x && yPos >= guess.y && width <= guess.width && height <= guess.height)) 
    return res.json({ init: sessionInit });

  const characterGuess = await prisma.characterGuess.create({
    data: {
      timedSessionInitialTime: sessionInit,
      imageCharacterImagePath: character.imagePath,
      imageCharacterCharacterName: character.characterName
    }
  })

  const charactersInImage = await prisma.imageCharacter.findMany({
    where: {
      imagePath: character.imagePath
    }
  })

  const guesses = await prisma.characterGuess.findMany({
    where: {
      timedSessionInitialTime: sessionInit
    }
  })

  if (charactersInImage.length === guesses.length) return res.json({
    init: sessionInit,
    finished: characterGuess.finalTime,
    sessionFinished: characterGuess.finalTime
  })

  res.json({ init: sessionInit, finished: characterGuess.finalTime });
}) as RequestHandler))

apiRouter.get("/players/scores", async (req, res, next) => {
  const scores = await prisma.player.findMany({
    orderBy: { scoreSeconds: "asc" }
  });

  return res.json(scores);
})

apiRouter.post("/players/scores", [
    body("init").isDate(), 
    body("username").trim().notEmpty()
  ], 
  ((async(req, res, next) => {
  const validationErrors = validationResult(req);
  
  if (!validationErrors.isEmpty()) return res.status(400).json(validationErrors.array());

  const sessionInit = req.body.init;
  const userName: string = req.body.username;

  const guesses = await prisma.characterGuess.findMany({
    where: {
      timedSessionInitialTime: sessionInit
    },
    orderBy: {
      finalTime: "desc"
    },
    include: {
      character: true
    }
  })

  if (guesses.length <= 0) return res.status(400).send("No guess made");

  const lastGuess = guesses[0];

  const charactersInImage = await prisma.imageCharacter.findMany({
    where: {
      imagePath: lastGuess?.character.imagePath!
    }
  })

  if (charactersInImage.length > guesses.length) return res.status(400).send("There are more characters to guess");

  const score = Number(guesses[0]?.timedSessionInitialTime) - Number(guesses[0]?.finalTime);

  const createdScore = await prisma.player.upsert({
    where: {
      name: userName
    },
    create: {
      name: userName,
      scoreSeconds: score
    },
    update: {
      scoreSeconds: score
    }
  })

  res.sendStatus(200);
}) as RequestHandler))

app.use((err: any, _: any, res: any, __: any) => {
  console.error(err.stack);
  res.send(err.message);
})

app.listen(PORT, e => {
  if (e) return console.error(e);

  console.log(`Listening on port ${PORT}`)
})