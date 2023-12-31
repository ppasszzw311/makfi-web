import { Route, Routes } from "react-router";
import Home from "./Home";
import Calculator from "./pages/Calculator";
import Content from "./pages/Content";

function App() {
  return (
    <Routes>
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/content" element={<Content />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
