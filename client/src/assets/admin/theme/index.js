// @mui material components
import { createTheme } from "@mui/material/styles";

// Vision UI Dashboard React base styles
import colors from "src/assets/admin/theme/base/colors";
import breakpoints from "src/assets/admin/theme/base/breakpoints";
import typography from "src/assets/admin/theme/base/typography";
import boxShadows from "src/assets/admin/theme/base/boxShadows";
import borders from "src/assets/admin/theme/base/borders";
import globals from "src/assets/admin/theme/base/globals";

// Vision UI Dashboard React helper functions
import boxShadow from "src/assets/admin/theme/functions/boxShadow";
import hexToRgb from "src/assets/admin/theme/functions/hexToRgb";
import linearGradient from "src/assets/admin/theme/functions/linearGradient";
import tripleLinearGradient from "src/assets/admin/theme/functions/tripleLinearGradient";
import pxToRem from "src/assets/admin/theme/functions/pxToRem";
import rgba from "src/assets/admin/theme/functions/rgba";

// Vision UI Dashboard React components base styles for @mui material components
import sidenav from "src/assets/admin/theme/components/sidenav";
import list from "src/assets/admin/theme/components/list";
import listItem from "src/assets/admin/theme/components/list/listItem";
import listItemText from "src/assets/admin/theme/components/list/listItemText";
import card from "src/assets/admin/theme/components/card";
import cardMedia from "src/assets/admin/theme/components/card/cardMedia";
import cardContent from "src/assets/admin/theme/components/card/cardContent";
import button from "src/assets/admin/theme/components/button";
import iconButton from "src/assets/admin/theme/components/iconButton";
import inputBase from "src/assets/admin/theme/components/form/inputBase";
import menu from "src/assets/admin/theme/components/menu";
import menuItem from "src/assets/admin/theme/components/menu/menuItem";
import switchButton from "src/assets/admin/theme/components/form/switchButton";
import divider from "src/assets/admin/theme/components/divider";
import tableContainer from "src/assets/admin/theme/components/table/tableContainer";
import tableHead from "src/assets/admin/theme/components/table/tableHead";
import tableCell from "src/assets/admin/theme/components/table/tableCell";
import linearProgress from "src/assets/admin/theme/components/linearProgress";
import breadcrumbs from "src/assets/admin/theme/components/breadcrumbs";
import slider from "src/assets/admin/theme/components/slider";
import avatar from "src/assets/admin/theme/components/avatar";
import tooltip from "src/assets/admin/theme/components/tooltip";
import appBar from "src/assets/admin/theme/components/appBar";
import tabs from "src/assets/admin/theme/components/tabs";
import tab from "src/assets/admin/theme/components/tabs/tab";
import stepper from "src/assets/admin/theme/components/stepper";
import step from "src/assets/admin/theme/components/stepper/step";
import stepConnector from "src/assets/admin/theme/components/stepper/stepConnector";
import stepLabel from "src/assets/admin/theme/components/stepper/stepLabel";
import stepIcon from "src/assets/admin/theme/components/stepper/stepIcon";
import select from "src/assets/admin/theme/components/form/select";
import formControlLabel from "src/assets/admin/theme/components/form/formControlLabel";
import formLabel from "src/assets/admin/theme/components/form/formLabel";
import checkbox from "src/assets/admin/theme/components/form/checkbox";
import radio from "src/assets/admin/theme/components/form/radio";
import autocomplete from "src/assets/admin/theme/components/form/autocomplete";
import input from "src/assets/admin/theme/components/form/input";
import container from "src/assets/admin/theme/components/container";
import popover from "src/assets/admin/theme/components/popover";
import buttonBase from "src/assets/admin/theme/components/buttonBase";
import icon from "src/assets/admin/theme/components/icon";
import svgIcon from "src/assets/admin/theme/components/svgIcon";
import link from "src/assets/admin/theme/components/link";

export default createTheme({
  breakpoints: { ...breakpoints },
  palette: { ...colors },
  typography: { ...typography },
  boxShadows: { ...boxShadows },
  borders: { ...borders },
  functions: {
    boxShadow,
    hexToRgb,
    linearGradient,
    tripleLinearGradient,
    pxToRem,
    rgba,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ...globals,
        ...container,
      },
    },
    MuiDrawer: { ...sidenav },
    MuiList: { ...list },
    MuiListItem: { ...listItem },
    MuiListItemText: { ...listItemText },
    MuiCard: { ...card },
    MuiCardMedia: { ...cardMedia },
    MuiCardContent: { ...cardContent },
    MuiButton: { ...button },
    MuiIconButton: { ...iconButton },
    MuiInputBase: { ...inputBase },
    MuiMenu: { ...menu },
    MuiMenuItem: { ...menuItem },
    MuiSwitch: { ...switchButton },
    MuiDivider: { ...divider },
    MuiTableContainer: { ...tableContainer },
    MuiTableHead: { ...tableHead },
    MuiTableCell: { ...tableCell },
    MuiLinearProgress: { ...linearProgress },
    MuiBreadcrumbs: { ...breadcrumbs },
    MuiSlider: { ...slider },
    MuiAvatar: { ...avatar },
    MuiTooltip: { ...tooltip },
    MuiAppBar: { ...appBar },
    MuiTabs: { ...tabs },
    MuiTab: { ...tab },
    MuiStepper: { ...stepper },
    MuiStep: { ...step },
    MuiStepConnector: { ...stepConnector },
    MuiStepLabel: { ...stepLabel },
    MuiStepIcon: { ...stepIcon },
    MuiSelect: { ...select },
    MuiFormControlLabel: { ...formControlLabel },
    MuiFormLabel: { ...formLabel },
    MuiCheckbox: { ...checkbox },
    MuiRadio: { ...radio },
    MuiAutocomplete: { ...autocomplete },
    MuiInput: { ...input },
    MuiOutlinedInput: { ...input },
    MuiFilledInput: { ...input },
    MuiPopover: { ...popover },
    MuiButtonBase: { ...buttonBase },
    MuiIcon: { ...icon },
    MuiSvgIcon: { ...svgIcon },
    MuiLink: { ...link },
  },
});
