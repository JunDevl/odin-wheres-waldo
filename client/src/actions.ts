const HEADERS: HeadersInit = {
  'content-type': "application/json"
}

export const getImage = async () => {
  const fetchedImages = await fetch(`${import.meta.env["VITE_API_URI"]!}/image`)

  if (!fetchedImages.ok) throw new Error(await fetchedImages.json());

  const images = await fetchedImages.blob();

  const buffer = await images.arrayBuffer();

  return buffer;
}

export const initGame = async () => {
  const fetchInit = await fetch(`${import.meta.env["VITE_API_URI"]!}/game/init`);

  if (!fetchInit.ok) throw new Error(await fetchInit.json());

  const { init }: { init: string } = await fetchInit.json();
  localStorage.setItem("sessionTimestamp", init);


  return init;
}

export const guessImage = async (x: number, y: number, name: string) => {
  const guess = await fetch(`${import.meta.env["VITE_API_URI"]!}/image/guess`, {
    headers: HEADERS,
    method: "POST",
    body: JSON.stringify({
      init: localStorage.getItem("sessionTimestamp"),
      targetPixel: { x, y },
      characterName: name
    })
  })

  if (!guess.ok) throw new Error(await guess.json());

  const response: { init: string, finished?: string, sessionFinished?: string } = await guess.json();

  return response;
}

export const getUsersScores = async () => {
  const fetchedScores = await fetch(`${import.meta.env["VITE_API_URI"]!}/players/scores`);

  if (!fetchedScores.ok) throw new Error(await fetchedScores.json());

  const scores: { score: number, user: string }[] = await fetchedScores.json();

  return scores;
}

export const setUserScore = async (username: string) => {
  const user = await fetch(`${import.meta.env["VITE_API_URI"]!}/players/scores`, {
    headers: HEADERS,
    method: "POST",
    body: JSON.stringify({ 
      init: localStorage.getItem("sessionTimestamp"),
      username
    })
  })

  if (!user.ok) throw new Error(await user.json());

  const response = user.text();

  return response;
}