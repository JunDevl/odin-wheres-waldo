import JSZip from "jszip";

const HEADERS: HeadersInit = {
  'content-type': "application/json"
}

export const getImages = async () => {
  try {
    const fetchedZippedImages = await fetch(`${import.meta.env["VITE_API_URI"]!}/images`)

    if (!fetchedZippedImages.ok) throw new Error(await fetchedZippedImages.json());

    const zippedImages = await fetchedZippedImages.blob();

    const url = URL.createObjectURL(zippedImages);

    const zip = await JSZip.loadAsync(zippedImages);
    const images: Blob[] = [];

    for (const filename of Object.keys(zip.files)) {
      const file = zip.files[filename];
      
      // Skip directories if any exist
      if (file.dir) continue;

      // Extract the raw file data as an individual image Blob
      const imageBlob = await file.async("blob");
      
      images.push(imageBlob);
    }

    return images;
  } catch (e) {
    console.error(e);
    return [];
  }
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