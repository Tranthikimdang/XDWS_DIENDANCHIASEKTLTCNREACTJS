// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";

// Vision UI Dashboard React components
import VuiBox from "src/components/admin/VuiBox";
import VuiTypography from "src/components/admin/VuiTypography";


function Activate({ titleActivate }) {
  
  return (
    <Card
      sx={{
        height: "100%",
      }}
    >
      <VuiBox display="flex" mb="14px" justifyContent="space-between" alignItems="center">
        <VuiTypography variant="lg" fontWeight="bold" color="white" textTransform="capitalize">
          {titleActivate}
        </VuiTypography>
      </VuiBox>
      <VuiBox>
        <VuiBox mb={2} lineHeight={1}>
          <VuiTypography variant="button" color="text" fontWeight="regular">
            {/* {description} */}
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </Card>
  );
}

// Typechecking props for the Introduce
Activate.propTypes = {
  titleActivate: PropTypes.string.isRequired,
};

export default Activate;
