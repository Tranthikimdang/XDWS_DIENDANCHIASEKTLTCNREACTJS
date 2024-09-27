import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet, Route } from "react-router-dom";

// @mui material components
import CssBaseline from "@mui/material/CssBaseline";
import SettingsIcon from '@mui/icons-material/Settings';
import { ThemeProvider } from "@mui/material/styles";

// Vision UI Dashboard React components
import VuiBox from "src/components/admin/VuiBox";

// Vision UI Dashboard React example components
import Sidenav from "src/examples/Sidenav";

// Vision UI Dashboard React themes
import theme from "src/assets/admin/theme";

import routes from "src/routes/routes";

// Vision UI Dashboard React contexts
import { setMiniSidenav, setOpenConfigurator, useVisionUIController } from "src/context";

export default function AdminLayout() {  // Should be AdminLayout instead of App
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, direction, sidenavColor, openConfigurator } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate(); // useNavigate instead of useHistory

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route path={route.route} element={<route.component />} key={route.key} />; // Use element instead of component
      }

      return null;
    });

  const configsButton = (
    <VuiBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.5rem"
      height="3.5rem"
      bgColor="info"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="white"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <SettingsIcon fontSize="default" color="inherit" />
    </VuiBox>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Sidenav
        color={sidenavColor}
        brand=""
        brandName="SHARE CODE"
        routes={routes}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      />
      {configsButton}
      {/* Uncomment this to enable routing */}
      <Outlet />
    </ThemeProvider>
  );
}
