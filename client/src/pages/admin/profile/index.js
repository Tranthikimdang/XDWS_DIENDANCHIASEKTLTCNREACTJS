import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
// Images
// Vision UI Dashboard React components
import VuiBox from "src/components/admin/VuiBox";
import ProfileInfoCard from "src/examples/Cards/InfoCards/ProfileInfoCard";
// Vision UI Dashboard React example src/components
import DashboardLayout from "src/examples/LayoutContainers/DashboardLayout";
// Overview page components
import Header from "./components/Header";
import Welcome from "../profile/components/Welcome/index";


function Overview() {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUserInfo(userData);
    }
  }, []);

  return (
    <DashboardLayout>
      <Header />
      <VuiBox mt={5} mb={3}>
        <Grid
          container
          spacing={3}
          sx={({ breakpoints }) => ({
            [breakpoints.only("xl")]: {
              gridTemplateColumns: "repeat(2, 1fr)",
            },
          })}
        >
          <Grid
            item
            xs={12}
            xl={4}
            xxl={3}
            sx={({ breakpoints }) => ({
              minHeight: "400px",
              [breakpoints.only("xl")]: {
                gridArea: "1 / 1 / 2 / 2",
              },
            })}
          >
            <Welcome />
          </Grid>

          <Grid
            item
            xs={12}
            xl={4}
            xxl={3}
            sx={({ breakpoints }) => ({
              [breakpoints.only("xl")]: {
                gridArea: "1 / 2 / 2 / 3",
              },
            })}
          >
            <ProfileInfoCard
              title="Profile Information"
              description={userInfo.description || "Hi, I’m " + (userInfo.name || "User") + "."}
              info={{
                fullName: userInfo.name || "User Name",
                mobile: userInfo.phone|| "Mobile Number",
                email: userInfo.email || "Email",
                location: userInfo.location || "Location",
              }}
              social={[
                {
                  link: "https://www.facebook.com/CreativeTim/",
                  icon: <FacebookIcon />,
                  color: "facebook",
                },
                {
                  link: "https://twitter.com/creativetim",
                  icon: <TwitterIcon />,
                  color: "twitter",
                },
                {
                  link: "https://www.instagram.com/creativetimofficial/",
                  icon: <InstagramIcon />,
                  color: "instagram",
                },
              ]}
            />
          </Grid>
          
        </Grid>
      </VuiBox>
   
    </DashboardLayout>
  );
}

export default Overview;
