// layouts/user/data/authorsTableData.js

import React from 'react';
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiAvatar from "components/VuiAvatar";
import { Link } from "react-router-dom";

// Images
import avatar1 from "assets/images/avatar1.png";
import avatar2 from "assets/images/avatar2.png";
import avatar3 from "assets/images/avatar3.png";
import avatar4 from "assets/images/avatar4.png";
import avatar5 from "assets/images/avatar5.png";
import avatar6 from "assets/images/avatar6.png";
import avatar7 from "assets/images/avatar7.png"; // Add these additional avatars
import avatar8 from "assets/images/avatar8.png";
import avatar9 from "assets/images/avatar9.png";
import avatar10 from "assets/images/avatar10.png";

function User({ image, name, email }) {
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
    { name: "ordinal", align: "left" },
    { name: "user", align: "left" },
    { name: "location", align: "left" },
    { name: "phone", align: "left" },
    { name: "action", align: "left" },
  ],

  rows: [
    {
      ordinal: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          1
        </VuiTypography>
      ),
      user: <User image={avatar1} name="Esthera Jackson" email="esthera@simmmple.com" />,
      location: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          New York
        </VuiTypography>
      ),
      phone: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          123-456-7890
        </VuiTypography>
      ),
      action: (
        <div>
           <Link to="/formedituser">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(2)}>Edit</button>
          </Link>
          <Link to="/formdeletecate">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(1)}>Delete</button>
          </Link>
        </div>
      ),
    },
    {
      ordinal: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          2
        </VuiTypography>
      ),
      user: <User image={avatar2} name="Alexa Liras" email="alexa@simmmple.com" />,
      location: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Los Angeles
        </VuiTypography>
      ),
      phone: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          987-654-3210
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/formedituser">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(2)}>Edit</button>
          </Link>
          <Link to="/formdeletecate">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(2)}>Delete</button>
          </Link>
        </div>
      ),
    },
    {
      ordinal: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          3
        </VuiTypography>
      ),
      user: <User image={avatar3} name="Laurent Michael" email="laurent@simmmple.com" />,
      location: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Chicago
        </VuiTypography>
      ),
      phone: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          555-123-4567
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/formedituser">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(3)}>Edit</button>
          </Link>
          <Link to="/formdeletecate">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(3)}>Delete</button>
          </Link>
        </div>
      ),
    },
    {
      ordinal: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          4
        </VuiTypography>
      ),
      user: <User image={avatar4} name="Freduardo Hill" email="freduardo@simmmple.com" />,
      location: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Miami
        </VuiTypography>
      ),
      phone: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          321-654-9870
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/formdeletecate">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(4)}>Delete</button>
          </Link>
        </div>
      ),
    },
    {
      ordinal: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          5
        </VuiTypography>
      ),
      user: <User image={avatar5} name="Daniel Thomas" email="daniel@simmmple.com" />,
      location: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Boston
        </VuiTypography>
      ),
      phone: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          654-321-0987
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/formdeletecate">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(5)}>Delete</button>
          </Link>
        </div>
      ),
    },
    {
      ordinal: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          6
        </VuiTypography>
      ),
      user: <User image={avatar6} name="Mark Wilson" email="mark@simmmple.com" />,
      location: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          San Francisco
        </VuiTypography>
      ),
      phone: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          789-012-3456
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/formedituser">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(6)}>Edit</button>
          </Link>
          <Link to="/formdeletecate">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(6)}>Delete</button>
          </Link>
        </div>
      ),
    },
    {
      ordinal: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          7
        </VuiTypography>
      ),
      user: <User image={avatar7} name="Sarah Connor" email="sarah@simmmple.com" />,
      location: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Seattle
        </VuiTypography>
      ),
      phone: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          654-789-1234
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/formedituser">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(7)}>Edit</button>
          </Link>
          <Link to="/formdeletecate">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(7)}>Delete</button>
          </Link>
        </div>
      ),
    },
    {
      ordinal: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          8
        </VuiTypography>
      ),
      user: <User image={avatar8} name="James Smith" email="james@simmmple.com" />,
      location: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Denver
        </VuiTypography>
      ),
      phone: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          321-987-6543
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/formedituser">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(8)}>Edit</button>
          </Link>
          <Link to="/formdeletecate">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(8)}>Delete</button>
          </Link>
        </div>
      ),
    },
    {
      ordinal: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          9
        </VuiTypography>
      ),
      user: <User image={avatar9} name="Anna Williams" email="anna@simmmple.com" />,
      location: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Atlanta
        </VuiTypography>
      ),
      phone: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          789-456-1230
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/formedituser">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(9)}>Edit</button>
          </Link>
          <Link to="/formdeletecate">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(9)}>Delete</button>
          </Link>
        </div>
      ),
    },
    {
      ordinal: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          10
        </VuiTypography>
      ),
      user: <User image={avatar10} name="Michael Brown" email="michael@simmmple.com" />,
      location: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Austin
        </VuiTypography>
      ),
      phone: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          456-123-7890
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/formedituser">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(10)}>Edit</button>
          </Link>
          <Link to="/formdeletecate">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(10)}>Delete</button>
          </Link>
        </div>
      ),
    },
  ],
};
