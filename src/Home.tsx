import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <Button variant="contained" sx={{ margin: '1rem'}} onClick={() => navigate("/calculator")}>到計算機</Button>
      <Button variant="contained" onClick={() => navigate("/content")}>到內容</Button>
    </>
  );
};

export default Home;
