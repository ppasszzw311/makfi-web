import { useNavigate } from "react-router";
import { Box, Button, Card, IconButton, TextField, Typography, colors, styled } from "@mui/material";

const Calculator = () => {
    const navigate = useNavigate();
    return (
        <Box>
            <Button onClick={() => navigate("/")}>回首頁</Button>
            <Box margin={1} textAlign={"center"}>
                <Typography variant="h4" color={"default"}>一般計算機</Typography>
                <Typography>
                    提供簡單計算
                </Typography>
                
            </Box>
            <Card sx={{width:"300px"}}>
                <Box textAlign={"center"}>
                <TextField disabled />
                </Box>
               <Box margin={1} textAlign={"center"}>
               <IconButton color="info"  sx={btnStyle}>A</IconButton> 
               </Box>
            </Card>
        </Box>
    )
}

export default Calculator;

const btnStyle = {
    bgcolor: 'primary.main', width: 40, height: 40, color: "white",  ":hover": { color: "primary.main" },
}