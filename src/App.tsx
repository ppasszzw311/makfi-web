import { Route, Routes } from "react-router";
import Home from "./Home";
import Calculator from "./pages/Calculator";
import WeatherMap from "./pages/WeatherMap";

function App() {
  return (
    <Routes>
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/content" element={<WeatherMap />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
