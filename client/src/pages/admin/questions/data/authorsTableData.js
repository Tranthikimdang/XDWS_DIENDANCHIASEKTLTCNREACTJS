
import React from 'react';
import VuiBox from "src/components/admin/VuiBox";
import VuiTypography from "src/components/admin/VuiTypography";
import VuiAvatar from "src/components/admin/VuiAvatar";
import VuiBadge from "src/components/admin/VuiBadge";
import { Link } from "react-router-dom";


export default {
  columns: [
    { name: "#", align: "left" },
    { name: "user_name", align: "center" },
    { name: "content", align: "center" },
    { name: "created_date", align: "center" },
    { name: "updated_date", align: "center" },
    { name: "action", align: "center" },
  ],

};