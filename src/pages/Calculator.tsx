import { useNavigate } from "react-router";
import { Box, Button, Typography } from "@mui/material";
import CalculatorTool from "../component/calculatorTool/CalculatorTool";

const Calculator = () => {
  const navigate = useNavigate();
  return (
    <Box>
      <Button onClick={() => navigate("/")}>回首頁</Button>
      <Box margin={1} textAlign={"center"}>
        <Typography variant="h4" color={"default"}>
          一般計算機
        </Typography>
        <Typography>提供簡單計算</Typography>
      </Box>
      <Box textAlign={"center"}>
        <CalculatorTool />
      </Box>
    </Box>
  );
};

export default Calculator;
