import { useSuspenseQuery } from "@tanstack/react-query";
import { getImages } from "./actions";
import { Suspense } from "react";

function App() {
  const { data: images } = useSuspenseQuery({
    queryKey: ["images"],
    queryFn: () => getImages()
  })

  return (
    <div id="home">
      <h1>Select an image!</h1>
      <main>
        <ul id="image_list">
          <Suspense fallback={<p>Loading ...</p>}>
            {images.map(image => {
              const blobURL = URL.createObjectURL(image);

              return (<li className="selectable_image">
                <img src={blobURL} className="guess_image"></img>
              </li>)
            })}
          </Suspense>
        </ul>
      </main>
    </div>
  )
}

export default App
