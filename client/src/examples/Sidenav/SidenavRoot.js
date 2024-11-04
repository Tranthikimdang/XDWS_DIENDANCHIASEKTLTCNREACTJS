import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import linearGradient from "src/assets/admin/theme/functions/linearGradient";

export default styled(Drawer)(({ theme, ownerState }) => {
  const { palette, boxShadows, transitions, breakpoints, functions } = theme;
  const { transparentSidenav, miniSidenav } = ownerState;

  const sidebarWidth = 260;
  const { transparent, gradients } = palette;
  const { xxl } = boxShadows;
  const { pxToRem } = functions;

  // Styles cho sidenav khi miniSidenav={false}
  const drawerOpenStyles = () => ({
    transform: "translateX(0)",
    transition: transitions.create("transform", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),
    [breakpoints.up("xl")]: {
      boxShadow: transparentSidenav ? "none" : xxl,
      marginBottom: transparentSidenav ? 0 : "inherit",
      left: "0",
      width: sidebarWidth,
      transform: "translateX(0)",
      transition: transitions.create(["width", "background-color"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),
    },
  });

  // Styles cho sidenav khi miniSidenav={true}
  const drawerCloseStyles = () => ({
    transform: `translateX(${pxToRem(-320)})`,
    transition: transitions.create("transform", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),
    [breakpoints.up("xl")]: {
      boxShadow: transparentSidenav ? "none" : xxl,
      marginBottom: transparentSidenav ? 0 : "inherit",
      left: "0",
      width: pxToRem(96),
      overflowX: "hidden",
      transform: "translateX(0)",
      transition: transitions.create(["width", "background-color"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.shorter,
      }),
    },
  });

  return {
    "& .MuiDrawer-paper": {
      boxShadow: xxl,
      border: "none",
      background: transparentSidenav
        ? transparent.main
        : linearGradient(
            gradients.sidenav.main,
            gradients.sidenav.state,
            gradients.sidenav.deg
          ),
      backdropFilter: transparentSidenav ? "unset" : "blur(120px)",
      height: "95vh", // Đảm bảo Drawer chiếm toàn bộ chiều cao màn hình
      display: "flex",
      flexDirection: "column",
      overflowY: "auto", // Không cho phép cuộn trên chính Drawer

      ...(miniSidenav ? drawerCloseStyles() : drawerOpenStyles()),

      "& .drawer-content": {
        flex: 1,
        overflowY: "auto",  // Cho phép cuộn cho nội dung
        padding: theme.spacing(2),  // Để nội dung không quá sát

        // Ẩn thanh cuộn
        "&::-webkit-scrollbar": {
          width: "0px",  // Ẩn thanh cuộn cho Webkit (Chrome, Safari)
        },
        "-ms-overflow-style": "none",  // Ẩn thanh cuộn cho IE và Edge
        "scrollbar-width": "none",     // Ẩn thanh cuộn cho Firefox
      },
    },
  };
});
