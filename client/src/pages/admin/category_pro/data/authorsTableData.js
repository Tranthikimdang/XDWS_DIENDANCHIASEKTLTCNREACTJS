import React from 'react';
import VuiBox from "../../../../components/admin/VuiBox";
import VuiTypography from "../../../../components/admin/VuiTypography";
import VuiAvatar from "../../../../components/admin/VuiAvatar";
import { Link } from "react-router-dom";

function Author({ image, name, email }) {
  return (
    <VuiBox display="flex" alignItems="center" px={1} py={0.5}>
      <VuiBox mr={2}>
        <VuiAvatar src={image} alt={name} size="sm" variant="rounded" />
      </VuiBox>
      <VuiBox display="flex" flexDirection="column">
        <VuiTypography variant="button" color="white" fontWeight="medium">
          {name}
        </VuiTypography>
        <VuiTypography variant="caption" color="text">
          {email}
        </VuiTypography>
      </VuiBox>
    </VuiBox>
  );
}

function Function({ job, org }) {
  return (
    <VuiBox display="flex" flexDirection="column">
      <VuiTypography variant="caption" fontWeight="medium" color="white">
        {job}
      </VuiTypography>
      <VuiTypography variant="caption" color="text">
        {org}
      </VuiTypography>
    </VuiBox>
  );
}

const handleEdit = (ordinal) => {
  console.log("Edit", ordinal);
  // Thực hiện hành động chỉnh sửa ở đây
};

const handleDelete = (ordinal) => {
  console.log("Delete", ordinal);
  // Thực hiện hành động xóa ở đây
};

export default {
  columns: [
    { name: "no", align: "left" },
    { name: "name", align: "left" },
    { name: "action", align: "left" },
  ],
};
