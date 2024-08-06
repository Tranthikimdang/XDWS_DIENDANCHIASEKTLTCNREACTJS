import React from 'react';
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiAvatar from "components/VuiAvatar";
import { Link } from "react-router-dom";

export default {
  columns: [
    { name: "no", align: "left" },
    { name: "name", align: "left" },
    { name: "birthday", align: "center" },
    { name: "card id", align: "center" },
    { name: "email", align: "center" },
    { name: "password", align: "center" },
    { name: "location", align: "left" },
    { name: "phone", align: "center" },
    { name: "Role", align: "left" },
    { name: "action", align: "left" },
  ],
};
