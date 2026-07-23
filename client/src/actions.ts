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

export const guessImage = async (targetPixel: number) => {
  const guess = await fetch(`${import.meta.env["VITE_API_URI"]!}/image/guess`, {
    headers: HEADERS,
    method: "POST",
    body: JSON.stringify({
      init: localStorage.getItem("initTimestamp"),
      target: targetPixel
    })
  })

  if (!guess.ok) throw new Error(await guess.json());

  const response: { init: string | null, finished: string | null } = await guess.json();

  return response;
}

export const getUsersScores = async () => {
  const fetchedScores = await fetch(`${import.meta.env["VITE_API_URI"]!}/scores`);

  if (!fetchedScores.ok) throw new Error(await fetchedScores.json());

  const scores: { score: number, user: string }[] = await fetchedScores.json();

  return scores;
}

export const setUserScore = async (username: string) => {
  const user = await fetch(`${import.meta.env["VITE_API_URI"]!}/scores/${username}`, {
    headers: HEADERS,
    method: "POST",
    body: JSON.stringify({ init: localStorage.getItem("initTimestamp") })
  })

  if (!user.ok) throw new Error(await user.json());

  const response = user.text();

  return response;
}