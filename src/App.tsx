
import { Navigate, Route, Routes } from "react-router"

import { EditorPage } from "./pages/editor/EditorPage"

function App() {
  return (
    <Routes>
      <Route path="/konvajs-react" element={<EditorPage />} />
      <Route path="*" element={<Navigate to="/konvajs-react" replace />} />
    </Routes>
  )
}

export default App
