// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

// Vision UI Dashboard React components
import VuiBox from "src/components/admin/VuiBox";
import VuiTypography from "src/components/admin/VuiTypography";


function Personalinformation({ titlePersonalinformation, name, birthday, location, description, avatar }) {
  return (
    <Card
      sx={{
        height: "100%",
      }}
    >
      <VuiBox display="flex" mb="14px" justifyContent="space-between" alignItems="center">
        <VuiTypography variant="lg" fontWeight="bold" color="white" textTransform="capitalize">
          {titlePersonalinformation}
        </VuiTypography>
      </VuiBox>
      <VuiBox>
        <VuiBox>
          <VuiBox lineHeight={1}>
            <VuiTypography variant="button" color="text" fontWeight="regular">
              {avatar}
            </VuiTypography>
            <br />
            {/* Mô tả */}
            <VuiTypography variant="button" color="text" fontWeight="regular">
              <strong>Mô tả:</strong> {description}
            </VuiTypography>
            <br />
            {/* Tên */}
            <VuiTypography variant="button" color="text" fontWeight="regular">
              <strong>Tên:</strong> {name}
            </VuiTypography>
            <br />
            <VuiTypography variant="button" color="text" fontWeight="regular">
              <strong>Birthday:</strong> {birthday}
            </VuiTypography>
            <br />
            {/* Địa chỉ */}
            <VuiTypography variant="button" color="text" fontWeight="regular">
              <strong>Địa chỉ:</strong> {location}
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </VuiBox>
    </Card>
  );
}

// Typechecking props for the Personalinformation
Personalinformation.propTypes = {
  titleContact: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  skills: PropTypes.string.isRequired,
  experience_years: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Personalinformation;
