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

export default {
  columns: [
    { name: "id", align: "left" },
    { name: "categoryname", align: "left" },
    { name: "action", align: "left" },
  ],

  rows: [
    {
      id: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          1
        </VuiTypography>
      ),
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          HTML
        </VuiTypography>
      ),
      action: (
        <VuiBox display="flex" gap="10px">
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Add
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Delete
          </VuiTypography>
        </VuiBox>
      ),

    },
    {
      id: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          2
        </VuiTypography>
      ),
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          PHP
        </VuiTypography>
      ),
      action: (
        <VuiBox display="flex" gap="10px">
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Add
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Delete
          </VuiTypography>
        </VuiBox>
      ),

    },
    {
      id: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          3
        </VuiTypography>
      ),
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          React
        </VuiTypography>
      ),
      action: (
        <VuiBox display="flex" gap="10px">
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Add
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Delete
          </VuiTypography>
        </VuiBox>
      ),

    },
    {
      id: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          4
        </VuiTypography>
      ),
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          React
        </VuiTypography>
      ),
      action: (
        <VuiBox display="flex" gap="10px">
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Add
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Delete
          </VuiTypography>
        </VuiBox>
      ),
    },
    {
      id: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          5
        </VuiTypography>
      ),
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Angular
        </VuiTypography>
      ),
      action: (
        <VuiBox display="flex" gap="10px">
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            View
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Delete
          </VuiTypography>
        </VuiBox>
      ),
    },
    {
      id: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          6
        </VuiTypography>
      ),
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Vue
        </VuiTypography>
      ),
      action: (
        <VuiBox display="flex" gap="10px">
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Add
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Delete
          </VuiTypography>
        </VuiBox>
      ),
    },
    {
      id: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          7
        </VuiTypography>
      ),
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Svelte
        </VuiTypography>
      ),
      action: (
        <VuiBox display="flex" gap="10px">
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Add
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Delete
          </VuiTypography>
        </VuiBox>
      ),
    },
    {
      id: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          8
        </VuiTypography>
      ),
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Backbone
        </VuiTypography>
      ),
      action: (
        <VuiBox display="flex" gap="10px">
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            View
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Delete
          </VuiTypography>
        </VuiBox>
      ),
    },
    {
      id: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          9
        </VuiTypography>
      ),
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Ember
        </VuiTypography>
      ),
      action: (
        <VuiBox display="flex" gap="10px">
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Add
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Delete
          </VuiTypography>
        </VuiBox>
      ),
    },
    {
      id: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          10
        </VuiTypography>
      ),
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Meteor
        </VuiTypography>
      ),
      action: (
        <VuiBox display="flex" gap="10px">
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Add
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </VuiTypography>
          <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Delete
          </VuiTypography>
        </VuiBox>
        
      ),
    },
    

  ],
};
