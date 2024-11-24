// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import { Avatar } from "@mui/material";
// Vision UI Dashboard React components
import VuiBox from "src/components/admin/VuiBox";
import VuiTypography from "src/components/admin/VuiTypography";

// Vision UI Dashboard React base styles
import colors from "src/assets/admin/theme/base/colors";
import typography from "src/assets/admin/theme/base/typography";

function Skillcertificate({ titleskill, skills, experience_years, cv_url, certificate_url }) {
  return (
    <Card
      sx={{
        height: "100%",
      }}
    >
      <VuiBox display="flex" mb="14px" justifyContent="space-between" alignItems="center">
        <VuiTypography variant="lg" fontWeight="bold" color="white" textTransform="capitalize">
          {titleskill}
        </VuiTypography>
      </VuiBox>
      <VuiBox>
        <VuiBox>
          <VuiBox lineHeight={1}>
            {/* Kỹ năng */}
            <VuiTypography variant="button" color="text" fontWeight="regular">
              <strong>Kỹ năng:</strong> {skills}
            </VuiTypography>
            <br />
            {/* Kinh nghiệm */}
            <VuiTypography variant="button" color="text" fontWeight="regular">
              <strong>Kinh nghiệm:</strong> {experience_years} năm
            </VuiTypography>
            <br />
            {/* CV */}
            <VuiTypography variant="button" color="text" fontWeight="regular">
              <strong>CV:</strong> {cv_url}
            </VuiTypography>
            <br />
            {/* Chứng chỉ */}
            <VuiTypography variant="button" color="text" fontWeight="regular">
              <strong>Chứng chỉ:</strong> {certificate_url}
            </VuiTypography>
          </VuiBox>
        </VuiBox>

      </VuiBox>

    </Card>
  );
}

// Typechecking props for the Skillcertificate
Skillcertificate.propTypes = {
  titleskill: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  skills: PropTypes.string.isRequired,
  experience_years: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Skillcertificate;
