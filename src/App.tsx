
import { Navigate, Route, Routes } from "react-router"

import { EditorPage } from "./pages/editor/EditorPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<EditorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
