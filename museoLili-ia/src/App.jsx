import {BrowserRouter,Routes,Route} from "react-router-dom";

import CameraPage from "./pages/CameraPage";
import InfoPage from "./pages/InfoPage";

function App(){

  return(

    <BrowserRouter>

      <Routes>

        <Route
        path="/"
        element={<CameraPage/>}
        />

        <Route
        path="/info"
        element={<InfoPage/>}
        />

      </Routes>

    </BrowserRouter>

  )

}

export default App;