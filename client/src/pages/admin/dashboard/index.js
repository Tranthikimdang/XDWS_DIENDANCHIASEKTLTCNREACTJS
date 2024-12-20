// @mui material components
import Grid from "@mui/material/Grid";

// Vision UI Dashboard React components
import VuiBox from "src/components/admin/VuiBox";

// Vision UI Dashboard React example components
import DashboardLayout from "src/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "src/examples/Navbars/DashboardNavbar";
import Footer from "src/examples/Footer";
import MiniStatisticsCard from "src/examples/Cards/StatisticsCards/MiniStatisticsCard";

// Dashboard layout components
import WelcomeMark from "src/pages/admin/dashboard/components/WelcomeMark";

import SatisfactionRate from "src/pages/admin/dashboard/components/SatisfactionRate";
import ReferralTracking from "src/pages/admin/dashboard/components/ReferralTracking";

// React icons
import { IoGlobe } from "react-icons/io5";
import { IoWallet } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";

function Dashboard() {
  return (
    <VuiBox
      display="flex"
      flexDirection="column"
      minHeight="100vh"
    >
      <DashboardLayout>
        <DashboardNavbar />
        <VuiBox py={3}>

          <VuiBox mb={3}>
            <Grid container spacing="18px">
              <Grid item xs={12} lg={12} xl={5}>
                <WelcomeMark />
              </Grid>
              <Grid item xs={12} lg={6} xl={3}>
                <SatisfactionRate />
              </Grid>
              <Grid item xs={12} lg={6} xl={4}>
                <ReferralTracking />
              </Grid>
            </Grid>
          </VuiBox>
        </VuiBox>
      </DashboardLayout>
      <Footer />
    </VuiBox >
  );
}

export default Dashboard;
