import React from 'react';
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiAvatar from "components/VuiAvatar";
import VuiBadge from "components/VuiBadge";
import { Link } from "react-router-dom";


const handleDelete = (id) => {
  console.log("Delete", id);
  // Thực hiện hành động xóa ở đây
};

export default {
  columns: [
    { name: "id", align: "left" },
    { name: "name", align: "left" },
    { name: "email", align: "center" },
    { name: "description", align: "center" },
    { name: "action", align: "center" },
  ],
  
};