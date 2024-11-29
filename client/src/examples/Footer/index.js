// Vision UI Dashboard React components
import VuiBox from "src/components/admin/VuiBox";
import VuiTypography from "src/components/admin/VuiTypography";

function App() {
  return (
    <VuiBox
      display="flex"
      flexDirection="column"
      minHeight="10vh"
    >
      {/* Your main content here */}
      <VuiBox flex="1">
        {/* Other components */}
      </VuiBox>
      <Footer />
    </VuiBox>
  );
}

function Footer() {
  return (
    <VuiBox
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent="space-between"
      component="footer"
      py={2}
      pb={0}
      sx={{ mt: "auto" }}
    >
      <VuiBox item xs={12} sx={{ textAlign: "center" }}>
        <VuiTypography
          variant="button"
          sx={{ textAlign: "center", fontWeight: "400 !important" }}
          color="white"
        >
          @ 2024, FPT Polytechnic Can Tho - code by {""}
          <VuiTypography
            component="a"
            variant="button"
            href="https://react.dev/"
            sx={{ textAlign: "center", fontWeight: "500 !important" }}
            color="white"
            mr="2px"
          >
            React JS
          </VuiTypography>
        </VuiTypography>
      </VuiBox>
      
    </VuiBox>
  );
}

export default App;