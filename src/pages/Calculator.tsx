import { useNavigate } from "react-router";
import { Button } from "@mui/material";

const Calculator = () => {
    const navigate = useNavigate();
    return (
        <div>
            Cal
            <Button onClick={() => navigate("/")}>回首頁</Button>
        </div>
    )
}

export default Calculator;