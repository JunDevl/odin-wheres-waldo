-- CreateTable
CREATE TABLE "Player" (
    "name" TEXT NOT NULL,
    "scoreSeconds" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "TimedSession" (
    "initialTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimedSession_pkey" PRIMARY KEY ("initialTime")
);

-- CreateTable
CREATE TABLE "CharacterGuess" (
    "finalTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageCharacterImagePath" TEXT NOT NULL,
    "imageCharacterCharacterName" TEXT NOT NULL,
    "timedSessionInitialTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CharacterGuess_pkey" PRIMARY KEY ("finalTime")
);

-- CreateTable
CREATE TABLE "ImageCharacter" (
    "imagePath" TEXT NOT NULL,
    "characterName" TEXT NOT NULL,
    "xPos" INTEGER NOT NULL,
    "yPos" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,

    CONSTRAINT "ImageCharacter_pkey" PRIMARY KEY ("imagePath","characterName")
);

-- AddForeignKey
ALTER TABLE "CharacterGuess" ADD CONSTRAINT "CharacterGuess_timedSessionInitialTime_fkey" FOREIGN KEY ("timedSessionInitialTime") REFERENCES "TimedSession"("initialTime") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterGuess" ADD CONSTRAINT "CharacterGuess_imageCharacterImagePath_imageCharacterChara_fkey" FOREIGN KEY ("imageCharacterImagePath", "imageCharacterCharacterName") REFERENCES "ImageCharacter"("imagePath", "characterName") ON DELETE RESTRICT ON UPDATE CASCADE;
