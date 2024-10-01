// Vision UI Dashboard React Button Styles
import root from "src/assets/admin/theme/components/button/root";
import contained from "src/assets/admin/theme/components/button/contained";
import outlined from "src/assets/admin/theme/components/button/outlined";
import text from "src/assets/admin/theme/components/button/text";

export default {
  defaultProps: {
    disableRipple: true,
  },
  styleOverrides: {
    root: { ...root },
    contained: { ...contained.base },
    containedSizeSmall: { ...contained.small },
    containedSizeLarge: { ...contained.large },
    containedPrimary: { ...contained.primary },
    containedSecondary: { ...contained.secondary },
    outlined: { ...outlined.base },
    outlinedSizeSmall: { ...outlined.small },
    outlinedSizeLarge: { ...outlined.large },
    outlinedPrimary: { ...outlined.primary },
    outlinedSecondary: { ...outlined.secondary },
    text: { ...text.base },
    textSizeSmall: { ...text.small },
    textSizeLarge: { ...text.large },
    textPrimary: { ...text.primary },
    textSecondary: { ...text.secondary },
  },
};
