import { Navigate, type RouteObject } from "react-router";
import App from "./App";
import ImageGuess from "./components/ImageGuess/ImageGuess";
import PageNotFound from "./components/PageNotFound/PageNotFound";

const routes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to={'/home'} replace/>
  },
  {
    path: "/home",
    element: <App/>
  },
  {
    path: "/guess/:imagePath",
    element: <ImageGuess/>
  },
  {
    path: "*",
    element: <PageNotFound/>
  }
]

export default routes;