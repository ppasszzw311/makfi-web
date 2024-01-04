import { useState, useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";


import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Paper,
  SpeedDial,
  SpeedDialAction,
  Typography,
} from "@mui/material";
import {
  MdAdd,
  MdOutlineRemove,
  MdInfoOutline,
  MdModeEditOutline,
  MdNearMe,
  MdOutlineSettings,
  MdOutlineTimeline,
  MdLayers,
} from "react-icons/md";
import L, { map, latLng, tileLayer, MapOptions, Icon} from "leaflet";


import icon from "../assets/images/location.png";
import icon1 from "../assets/images/placeholder.png";

import "leaflet/dist/leaflet.css";

import siteLocation from "../assets/data/site.json";
import axios from "axios";
import { Line } from "react-chartjs-2";

import AboutDialog from "../component/weather-map/AboutDialog";

// 自定義圖示
const myIcon1 = L.icon({
  iconUrl: icon,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const myIcon2 = L.icon({
  iconUrl: icon1,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const WeatherMap = () => {
  const mapRef = useRef(null);
  const [openInfo, setOpenInfo] = useState(false);
  const [siteData, setSiteData] = useState([]); // [siteName, siteType, lat, lng, siteId, county

  // 取得縣市資料
  const [county, setCounty] = useState("");

  const handleZoomIn = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.setView(map.getCenter(), map.getZoom() + 1); // 执行放大操作
    }
  };

  //控制圖層
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClickLayer = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseLayer = () => {
    setAnchorEl(null);
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.setView(map.getCenter(), map.getZoom() - 1); // 执行缩小操作
    }
  };

  const handleNavigate = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.locate();
      map.on("locationfound", (e) => {
        map.setView(e.latlng, 16);
      });
    }
  };

  // 關閉目前已打開的地圖popup
  const closePopup = (map) => {
    map.eachLayer((layer) => {
      if (layer instanceof L.Popup) {
        layer.remove();
      }
    });
  };

  // 取得目前即時Zoom level
  const [zoomLevel, setZoomLevel] = useState(13);

  const getZoomLevel = () => {
    const map = mapRef.current;
    const zoom = map.getZoom();
    if (map.zoomControl) {
      map.removeControl(map.zoomControl);
    }
    if (!map.scaleControl) {
      // 新增比例尺
      const scaleControl = L.control
        .scale({
          metric: true,
          imperial: false,
        })
        .addTo(map);
      map.scaleControl = scaleControl;
    }
    
    setZoomLevel(zoom);
  };

  useEffect(() => {
    setTimeout(() => {
      getZoomLevel();
    }, 1000);
    const site = siteLocation.data.filter(
      (item) => item[1].substring(0, 2) === "46"
    );
    setSiteData(site);
  }, []);

  useEffect(() => {
    if (zoomLevel > 13) {
      // control layer
      setSiteData(siteLocation.data);
    } else {
      const site = siteLocation.data.filter(
        (item) => item[1].substring(0, 2) === "46"
      );
      setSiteData(site);
    }
  }, [zoomLevel]);

  // 打開指定屬性的popup
  const openPopup = (map, location) => {
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        if (layer.getLatLng().equals(location)) {
          layer.openPopup();
        }
      }
    });
  };

  // 點擊列表時，移動地圖
  const handleClick = (location) => {
    const map = mapRef.current;
    closePopup(map);
    openPopup(map, location);
    map.flyTo(location, 13);
  };

  // 取得地圖資料

  const hanldeDialog = (county) => {
    setCounty(county);
    const map = mapRef.current;
    closePopup(map);
    setOpenInfo(true);
  };
  return (
    <Container
      fixed
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <LayerMenu
        anchorEl={anchorEl}
        open={open}
        handleClose={handleCloseLayer}
      />
      <WeatherInfoDialog
        open={openInfo}
        onClose={() => setOpenInfo(false)}
        county={county}
      />
      <MapContainer
        center={[25.0, 121.09]}
        zoom={13}
        style={{
          height: "96vh",
          width: "100%",
          margin: "0.5rem",
          borderRadius: "0.5rem",
        }}
        ref={mapRef}
      >
        <IconButton
          onClick={handleClickLayer}
          sx={{
            position: "absolute",
            zIndex: 1000,
            top: "1rem",
            width: "4rem",
            height: "4rem",
            borderRadius: "1rem",
            bgcolor: "white",
            right: "1rem",
            ml: 2,
          }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <MdLayers style={{ fontSize: "3.5rem" }} />
        </IconButton>
        <Box
          sx={{
            position: "absolute",
            zIndex: 1000,
            top: "1rem",
            left: "1rem",
            borderRadius: "10rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "0.3rem solid white",
            bgcolor: "white",
          }}
        >
          <IconButton
            sx={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              backgroundColor: "white",
              border: "0.2rem solid text.secondary",
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "text.secondary",
                color: "white",
              },
            }}
            onClick={handleZoomIn}
          >
            <MdAdd style={{ fontSize: "2.2rem" }} />
          </IconButton>
          <IconButton
            sx={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              backgroundColor: "white",
              border: "0.2rem solid text.secondary",
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "text.secondary",
                color: "white",
              },
            }}
            onClick={handleZoomOut}
          >
            <MdOutlineRemove style={{ fontSize: "2.2rem" }} />
          </IconButton>
        </Box>

        <Box
          sx={{
            position: "absolute",
            zIndex: 1000,
            top: "7rem",
            left: "1rem",
            borderRadius: "10rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "0.3rem solid white",
            bgcolor: "white",
          }}
        >
          <IconButton
            sx={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              backgroundColor: "white",
              border: "0.2rem solid text.secondary",
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "text.secondary",
                color: "white",
              },
            }}
            onClick={handleNavigate}
          >
            <MdNearMe style={{ fontSize: "2.2rem" }} />
          </IconButton>
        </Box>

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {siteData.map((item: string[], index) => {
          const latLng = [Number(item[3]), Number(item[2])];
          return (
            <Marker
              key={index}
              position={latLng}
              icon={item[1].substring(0, 2) === "46" ? myIcon2 : myIcon1}
            >
              <Popup>
                <Typography variant="h5" component="div">
                  {item[0]}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {item[1].substring(0, 2) === "46" ? "局屬測站" : "自動測站"}
                </Typography>
                <Typography variant="body2">
                  緯度：{item[2]} <br />
                  經度：{item[3]} <br />
                </Typography>
                <Button onClick={() => hanldeDialog(item[5])}>
                  取得天氣資料
                </Button>
              </Popup>
            </Marker>
          );
        })}
        <MapSpeedDial />
      </MapContainer>
      <Box
        sx={{
          display: "flex",
          width: "25%",
          height: "96vh",
          backgroundColor: "#fff",
          margin: 0,
          borderRadius: "0.5rem",
          boxShadow: "0 0 0.5rem 0.1rem rgba(0, 0, 0, 0.1)",
        }}
      >
        <List
          sx={{
            width: "100%",
            paddingTop: 0,
            bgcolor: "background.paper",
            position: "relative",
            overflow: "auto",
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{
              textAlign: "center",
              bgcolor: "#2196f3",
              borderRadius: "0.5rem 0.5rem 0 0",
              padding: "0.3rem",
              color: "white",
              fontWeight: 700,
            }}
          >
            查看站點
          </Typography>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Drafts" />
            </ListItemButton>
          </ListItem>
          {siteData.map((item: string[], index) => {
            const latLng = [Number(item[3]), Number(item[2])];
            return (
              <CustomListItem
                key={index}
                name={item[0]}
                location={latLng}
                type={
                  item[1].substring(0, 2) === "46" ? "局屬測站" : "自動測站"
                }
                onClick={handleClick}
              />
            );
          })}
        </List>
      </Box>
    </Container>
  );
};


// 呈現圖層的
const LayerMenu = (props) => {
  const { anchorEl, handleClose, open } = props;
  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem onClick={handleClose}>圖層1</MenuItem>
      <MenuItem onClick={handleClose}>圖層2</MenuItem>
    </Menu>
  );
};

// 取得測站所在縣市天氣預報
const apiToken = "CWA-80BFADB3-4CFC-4E82-AC81-77022337F2A8";
const elementName = "MinT";
const getWeather = async (county: string) => {
  const url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${apiToken}&locationName=${county}&elementName=${elementName}`;
  try {
    const response = await axios.get(url);
    return response.data.records.location[0].weatherElement[0];
  } catch (error) {
    return new Error(error);
  }
};

const CustomListItem = (props) => {
  const { name, location, type, onClick } = props;

  const handleClick = () => {
    onClick(location);
  };
  return (
    <ListItem onClick={handleClick} disablePadding>
      <ListItemButton>
        <ListItemText primary={name} />
        {type}
      </ListItemButton>
    </ListItem>
  );
};

// 建立浮動功能表
const MapSpeedDial = () => {
  // 控制行動浮動按鈕的開關
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<MdOutlineSettings style={{ fontSize: "2.5rem" }} />}
      >
        <SpeedDialAction
          key="Action A"
          icon={<MdInfoOutline style={{ fontSize: "2.2rem" }} />}
          tooltipTitle="關於地圖"
          onClick={handleOpen}
        />
        <SpeedDialAction
          key="Action B"
          icon={<MdModeEditOutline style={{ fontSize: "2.2rem" }} />}
          tooltipTitle="編輯圖資"
        />
        <SpeedDialAction
          key="Action C"
          icon={<MdOutlineTimeline style={{ fontSize: "2.2rem" }} />}
          tooltipTitle="時間序列"
        />
      </SpeedDial>
      {open && <AboutDialog open={open} onClose={() => setOpen(false)} />}
    </>
  );
};

// 關於地圖
const WeatherInfoDialog = (props) => {
  const { onClose, open, county } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const resData = await getWeather(county);
        setData(resData.time);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    })();
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          36 小時天氣預報 - {county}
        </Typography>
      </DialogTitle>
      <Paper elevation={0} sx={{ padding: "0 1.5rem 2rem 1.5rem" }}>
        <Typography paragraph>
          <Line
            data={{
              labels: data
                ? data.map((row) => datetimeString(row.startTime))
                : [],
              datasets: [
                {
                  label: "預測氣溫",
                  data: data
                    ? data.map((row) => row.parameter.parameterName)
                    : [],
                  backgroundColor: "rgba(75,192,192,0.4)",
                  borderColor: "rgba(75,192,192,1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              indexAxis: "x", // 如果 x 轴是数值类型，则设置为 'y'
              scales: {
                x: { beginAtZero: true },
                y: { beginAtZero: false },
              },
            }}
          />
        </Typography>
      </Paper>
    </Dialog>
  );
};

const datetimeString = (input: string) => {
  const date = new Date(input);
  return new Intl.DateTimeFormat("zh-TW", {
    dateStyle: "short",
    timeStyle: "short",
    hour12: false,
  })
    .format(date)
    .replace(/\//g, "-");
};



export default WeatherMap;