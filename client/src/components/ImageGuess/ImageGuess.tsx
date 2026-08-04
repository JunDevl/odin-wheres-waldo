import "./imageguess.css"

import { useParams } from "react-router";
import { getImages, getPixelMargin, guessImage, initGame } from "../../actions";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useEffect, useRef, useState, type MouseEvent, type SubmitEvent } from "react";

const characters = ["Waldo", "Wizard", "Wilma"]

type Props = {}

const ImageGuess = (props: Props) => {
  const { data: init } = useQuery({
    queryKey: ["init"],
    queryFn: async () => {
      const init = localStorage.getItem("sessionTimestamp") ?? await initGame();

      return init;
    }
  })

  const { data: images } = useSuspenseQuery({
    queryKey: ["images"],
    queryFn: () => getImages()
  })

  const { data: margin } = useSuspenseQuery({
    queryKey: ["pixelMargin"],
    queryFn: () => getPixelMargin()
  })

  const params = useParams();

  const imageElement = useRef<HTMLImageElement>(null);

  const image = images.find(image => image.name === params.imagePath)!;

  const [selected, setSelected] = useState<{
    x: number | null, 
    y: number | null, 
    character: string | null
  }>({
    x: null,
    y: null,
    character: null
  })

  const handleClick = async (e: MouseEvent<HTMLImageElement, globalThis.MouseEvent>) => {
    const {
      x: imgElementX,
      y: imgElementY,
      width: imgElementWidth,
      height: imgElementHeight
    } = imageElement.current?.getBoundingClientRect()!;

    const elementSelectionPos = {
      x: e.clientX - imgElementX,
      y: e.clientY - imgElementY
    }

    const xRatio = imgElementWidth / imageElement.current?.naturalWidth!;
    const yRatio = imgElementHeight / imageElement.current?.naturalHeight!;

    const normalizedSelectionPos = {
      x: elementSelectionPos.x / xRatio,
      y: elementSelectionPos.y / yRatio,
    }

    setSelected({
      x: normalizedSelectionPos.x,
      y: normalizedSelectionPos.y,
      character: null
    })

    const parentDiv = imageElement.current?.parentElement as HTMLDivElement;

    parentDiv.classList.add("show_selection");

    const selectionElement = document.querySelector("#selection")! as HTMLDivElement;

    const marginRatio = (imgElementWidth * imgElementHeight) / (imageElement.current?.naturalWidth! * imageElement.current?.naturalHeight!);

    const normalizedMargin = margin * marginRatio;

    const imageContainer = document.querySelector("#image") as HTMLDivElement;

    imageContainer.style.setProperty("--margin-of-error", `${normalizedMargin}px`);

    selectionElement.style.left = `${elementSelectionPos.x - normalizedMargin}px`;
    selectionElement.style.top = `${elementSelectionPos.y - normalizedMargin}px`;
  }

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const guess = await guessImage(params.imagePath!, selected.x!, selected.y!, selected.character!)
  }

  return (
    <div id="image" className="show_selection">
      <Suspense fallback={<p>Loading ...</p>}>
        <img 
          src={URL.createObjectURL(image.blob)}
          onClick={handleClick}
          ref={imageElement}
        />
        <div id="selection" hidden={!selected.x || !selected.y}></div>
        <div id="menu" className={!selected.x || !selected.y ? "" : "show"}>
          <h3>Select the character:</h3>
          <ul id="characters">
            {characters.map(character => 
              <li 
                className={`character${selected.character === character ? " selected" : ""}`} 
                key={character} 
                onClick={() => setSelected(s => ({...s, character}))}
                id={character}
              >
                {character}
              </li>)
            }
          </ul>
          <form onSubmit={handleSubmit} className="buttons">
            <button className="guess" type="submit">Guess</button>
            <button 
              className="cancel" 
              type="reset" 
              onClick={() => setSelected({x: null, y: null, character: null})}
            >
              Cancel
            </button>
          </form>
        </div>
      </Suspense>
    </div>
  )
}

export default ImageGuess;