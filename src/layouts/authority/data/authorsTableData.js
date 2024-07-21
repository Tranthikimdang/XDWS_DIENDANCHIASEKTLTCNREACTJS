/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

/* eslint-disable react/prop-types */
// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiAvatar from "components/VuiAvatar";
import VuiBadge from "components/VuiBadge";

// Images
import avatar1 from "assets/images/avatar1.png";
import avatar2 from "assets/images/avatar2.png";
import avatar3 from "assets/images/avatar3.png";
import avatar4 from "assets/images/avatar4.png";
import avatar5 from "assets/images/avatar5.png";
import avatar6 from "assets/images/avatar6.png";

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
const projects = [
  {
    id: "HT00001",
    name: "Nam Hoàng Văn",
    assigned: "Quản lý nội dung",
    number_of_members: "2",
    created_date: "12/02/2002",
  },
  {
    id: "HT00002",
    name: "Nam Hoàng Văn",
    assigned: "Quản lý người dùng",
    number_of_members: "2",
    created_date: "12/02/2002",
  },
  {
    id: "HT00003",
    name: "Nam Hoàng Văn",
    assigned: "Quản lý cơ sở dữ liệu",
    number_of_members: "2",
    created_date: "12/02/2002",
  },
  {
    id: "HT00004",
    name: "Nam Hoàng Văn",
    assigned: "Quản lý nội dung",
    number_of_members: "2",
    created_date: "12/02/2002",
  },
  {
    id: "HT00003",
    name: "Nam Hoàng Văn",
    assigned: "Quản lý cơ sở dữ liệu",
    number_of_members: "2",
    created_date: "12/02/2002",
  },
  {
    id: "HT00004",
    name: "Nam Hoàng Văn",
    assigned: "Quản lý nội dung",
    number_of_members: "2",
    created_date: "12/02/2002",
  },
];

export default {
  columns: [
    { name: "id", align: "left" },
    { name: "name", align: "left" },
    { name: "assigned", align: "center" },
    { name: "number_of_members", align: "center" },
    { name: "created_date", align: "center" },
    { name: "action", align: "center" },
  ],

  rows: projects.map((project) => ({
    id: project.id,
    name: project.name,
    assigned: project.assigned,
    number_of_members: project.number_of_members,
    created_date: project.created_date,
    action:(<VuiBox display="flex" gap="10px">
      <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        View
      </VuiTypography>
      <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        Edit
      </VuiTypography>
      <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        Delete
      </VuiTypography>
    </VuiBox>) , // Replace this with your actual action
  })),
};
