import React from 'react';
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiAvatar from "components/VuiAvatar";
import VuiBadge from "components/VuiBadge";
import { Link } from "react-router-dom";

export default {
  columns: [
    { name: "#", align: "left" },
    { name: "title", align: "left" },
    { name: "image", align: "left" },
    { name: "content", align: "center" },
    { name: "created_date", align: "center" },
    { name: "action", align: "center" },
  ],

};