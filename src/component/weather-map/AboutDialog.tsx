import {Dialog, DialogTitle, Typography, Paper } from "@mui/material";

interface AboutDialogProps {
    open: boolean;
    onClose: unknown;
}

// 關於地圖
function AboutDialog(props) {
    const { onClose, selectedValue, open } = props;
  
    const handleClose = () => {
      onClose(selectedValue);
    };
  
    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            關於地圖
          </Typography>
        </DialogTitle>
        <Paper elevation={0} sx={{ padding: "0 1.5rem 2rem 1.5rem" }}>
          <Typography paragraph>
            這是公版地圖，使用了open street
            map與leaflet的結合，範例檔案取用資料為中央氣象局的測站資料，並使用react-leaflet套件來呈現地圖。基本上的操作如下:
            <br />
            * 點擊地圖上的圖標，可以查看該測站的資訊
            <br />
            * 點擊列表上的測站，可以移動地圖到該測站
            <br />* 在測站資訊中，可查看測站相關資訊，
            <br /> * 點擊取得天氣資料，即可呈現近36小時的天氣預報
            <br />* 點擊右下角的功能按鈕，可以開啟功能表
          </Typography>
        </Paper>
      </Dialog>
    );
  }

  export default AboutDialog;