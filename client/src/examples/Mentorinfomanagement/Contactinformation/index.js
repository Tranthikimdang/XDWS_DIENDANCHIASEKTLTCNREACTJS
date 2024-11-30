// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
// Vision UI Dashboard React components
import VuiBox from "src/components/admin/VuiBox";
import VuiTypography from "src/components/admin/VuiTypography";

// Vision UI Dashboard React base styles
import typography from "src/assets/admin/theme/base/typography";

function Contactinformation({ titleContact, email, phone, social }) {
  const { size } = typography;
  // Render the card social media icons
  const renderSocial = social.map(({ link, icon, color }) => (
    <VuiBox
      key={color}
      component="a"
      href={link}
      target="_blank"
      rel="noreferrer"
      fontSize={size.lg}
      color="white"
      pr={1}
      pl={0.5}
      lineHeight={1}
    >
      {icon}
    </VuiBox>
  ));
  return (
    <Card
      sx={{
        height: "100%",
      }}
    >
      <VuiBox display="flex" mb="14px" justifyContent="space-between" alignItems="center">
        <VuiTypography variant="lg" fontWeight="bold" color="white" textTransform="capitalize">
          {titleContact}
        </VuiTypography>
      </VuiBox>
      <VuiBox>
        <VuiBox>
          <VuiBox lineHeight={1}>
            {/* Email */}
            <VuiTypography variant="button" color="text" fontWeight="regular">
              <strong>Email:</strong> {email}
            </VuiTypography>
            <br />
            {/* Số điện thoại */}
            <VuiTypography variant="button" color="text" fontWeight="regular">
              <strong>Số điện thoại:</strong>(+84) {phone}
            </VuiTypography>
            <br />
            <VuiBox display="flex" py={1} pr={2} color="white">
              <VuiTypography
                variant="button"
                fontWeight="regular"
                color="text"
                textTransform="capitalize"
              >
                social: &nbsp;
              </VuiTypography>
              {renderSocial}
            </VuiBox>
          </VuiBox>
        </VuiBox>

      </VuiBox>

    </Card>
  );
}

// Typechecking props for the Contactinformation
Contactinformation.propTypes = {
  titleContact: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  social: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Contactinformation;
