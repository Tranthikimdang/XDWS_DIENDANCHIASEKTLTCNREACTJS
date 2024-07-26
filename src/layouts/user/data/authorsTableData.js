import React from 'react';
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiAvatar from "components/VuiAvatar";
import { Link } from "react-router-dom";
//import routes
import routes from "routes";

// Images
import avatar1 from "assets/images/avatar1.png";
import avatar2 from "assets/images/avatar2.png";
import avatar3 from "assets/images/avatar3.png";
import avatar4 from "assets/images/avatar4.png";
import avatar5 from "assets/images/avatar5.png";
import avatar6 from "assets/images/avatar6.png";

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

const handleEdit = (id) => {
  console.log("Edit", id);
  // Thực hiện hành động chỉnh sửa ở đây
};

const handleDelete = (id) => {
  console.log("Delete", id);
  // Thực hiện hành động xóa ở đây
};

export default {
  columns: [
    { name: "id", align: "left" },
    { name: "user", align: "left" },
    { name: "location", align: "left" },
    { name: "phone", align: "left" },
    { name: "action", align: "left" },
  ],

  rows: [
    {
      id: (
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
        
          <Link to="/formdeletecate">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(1)}>Delete</button>
          </Link>
        </div>
      ),
    },
    {
      id: (
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
      id: (
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
        <div className="mt-3">
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
      id: (
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
        <div className="mt-3">
          <Link to="/formedituser">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(4)}>Edit</button>
          </Link>
          <Link to="/formdeletecate">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(4)}>Delete</button>
          </Link>
        </div>
      ),
    },
    {
      id: (
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
        <div className="mt-3">
          <Link to="/formedituser">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(5)}>Edit</button>
          </Link>
          <Link to="/formdeletecate">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(5)}>Delete</button>
          </Link>
        </div>
      ),
    },
    {
      id: (
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
        <div className="mt-3">
          <Link to="/formedituser">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(6)}>Edit</button>
          </Link>
          <Link to="/formdeletecate">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(6)}>Delete</button>
          </Link>
        </div>
      ),
    },
  ],
};
