import React from 'react';
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiAvatar from "components/VuiAvatar";
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
    { name: "id", align: "left" },
    { name: "name", align: "left" },
    { name: "action", align: "left" },
  ],

  rows: [
    {
      ordinal: (
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
        <div>
          <Link to="/formeditcate">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(1)}>Edit</button>
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
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          PHP
        </VuiTypography>
      ),
      action: (
        <div className="mt-3">
          <Link to="/formeditcate">
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
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          React
        </VuiTypography>
      ),
      action: (
        <div className="mt-3">
          <Link to="/formeditcate">
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
          4
        </VuiTypography>
      ),
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          React
        </VuiTypography>
      ),
      action: (
        <div className="mt-3">
          <Link to="/formeditcate">
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
          5
        </VuiTypography>
      ),
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Angular
        </VuiTypography>
      ),
      action: (
        <div className="mt-3">
          <Link to="/formeditcate">
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
          6
        </VuiTypography>
      ),
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Vue
        </VuiTypography>
      ),
      action: (
        <div className="mt-3">
          <Link to="/formeditcate">
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
          7
        </VuiTypography>
      ),
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Svelte
        </VuiTypography>
      ),
      action: (
        <div className="mt-3">
          <Link to="/formeditcate">
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
          8
        </VuiTypography>
      ),
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Backbone
        </VuiTypography>
      ),
      action: (
        <div className="mt-3">
          <Link to="/formeditcate">
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
          9
        </VuiTypography>
      ),
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Ember
        </VuiTypography>
      ),
      action: (
        <div className="mt-3">
          <Link to="/formeditcate">
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
          10
        </VuiTypography>
      ),
      categoryname: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Meteor
        </VuiTypography>
      ),
      action: (
        <div className="mt-3">
          <Link to="/formeditcate">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(2)}>Edit</button>
          </Link>
          <Link to="/formdeletecate">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(2)}>Delete</button>
          </Link>
        </div>
      ),
    },
    

  ],
  
};
