import "./imageguess.css"

import { useParams } from "react-router";
import { getImages, getPixelMargin, guessImage } from "../../actions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useRef, useState, type MouseEvent } from "react";

type Props = {}

const ImageGuess = (props: Props) => {
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

    const selectonElement = document.querySelector("#selection")! as HTMLDivElement;

    selectonElement.style.left = `${elementSelectionPos.x - margin}px`;
    selectonElement.style.top = `${elementSelectionPos.y - margin}px`;

    // const guess = await guessImage(normalizedSelectionPos.x, normalizedSelectionPos.y, params.imagePath!)
  }

  return (
    <div id="image" className="show_selection">
      <Suspense fallback={<p>Loading ...</p>}>
        <img 
          src={URL.createObjectURL(image.blob)}
          onClick={handleClick}
          ref={imageElement}
        />
        <div id="selection"></div>
      </Suspense>
    </div>
  )
}

export default ImageGuess;