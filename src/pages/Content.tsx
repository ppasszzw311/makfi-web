import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Content = () => {
    const navigate = useNavigate();
    return (
        <div>
            Content
            <Button onClick={() => navigate('/')}>回首頁</Button>
        </div>
    )
}

export default Content;