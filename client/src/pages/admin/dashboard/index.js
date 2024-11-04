// @mui material components
import Grid from "@mui/material/Grid";
// import Icon from "@mui/material/Icon";
// import { Card, LinearProgress, Stack } from "@mui/material";

// Vision UI Dashboard React components
import VuiBox from "src/components/admin/VuiBox";
// import VuiTypography from "src/components/admin/VuiTypography";
// import VuiProgress from "src/components/admin/VuiProgress";

// Vision UI Dashboard React example components
import DashboardLayout from "src/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "src/examples//Navbars/DashboardNavbar";
// import MiniStatisticsCard from "src/examples/Cards/StatisticsCards/MiniStatisticsCard";
// import linearGradient from "src/assets/admin/theme/functions/linearGradient";

// Vision UI Dashboard React base styles
// import typography from "src/assets/admin/theme/base/typography";
import colors from "src/assets/admin//theme/base/colors";

// Dashboard layout components
// import WelcomeMark from "../dashboard/components/WelcomeMark";
import Projects from "../dashboard/components/Projects";
import OrderOverview from "../dashboard/components/OrderOverview";
// import SatisfactionRate from "../dashboard/components/SatisfactionRate";
import ReferralTracking from "../dashboard/components/ReferralTracking";

// // React icons
// import { IoIosRocket } from "react-icons/io";
// import { IoGlobe } from "react-icons/io5";
// import { IoBuild } from "react-icons/io5";
// import { IoWallet } from "react-icons/io5";
// import { IoDocumentText } from "react-icons/io5";
// import { FaShoppingCart } from "react-icons/fa";

// // Data
// import LineChart from "src/examples/Charts/LineCharts/LineChart";
// import BarChart from "src/examples/Charts/BarCharts/BarChart";
// import { lineChartDataDashboard } from "../dashboard/data/lineChartData";
// import { lineChartOptionsDashboard } from "../dashboard/data/lineChartOptions";
// import { barChartDataDashboard } from "../dashboard/data/barChartData";
// import { barChartOptionsDashboard } from "../dashboard/data/barChartOptions";

//Firestore

function Dashboard() {
  const { gradients } = colors;
  const { cardContent } = gradients;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Grid container spacing="18px">
            <Grid item xs={12} lg={6} xl={4}>
              <ReferralTracking />
            </Grid>
          </Grid>
        </VuiBox>
       
        <Grid container spacing={2} direction="row" justifyContent="space-between" alignItems="flex-start">
          <Grid item xs={12} md={6} lg={8}>
            <Projects />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <OrderOverview />
          </Grid>
        </Grid>
      </VuiBox>
    </DashboardLayout>
  );
}

export default Dashboard;

