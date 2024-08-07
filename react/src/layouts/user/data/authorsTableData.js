import React from 'react';
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiAvatar from "components/VuiAvatar";
import { Link } from "react-router-dom";

export default {
  columns: [
    { name: "ordinal", align: "left" },
    { name: "name", align: "left" },
    { name: "email", align: "center" },
    { name: "location", align: "left" },
    { name: "phone", align: "center" },
    { name: "action", align: "left" },
  ],
};
