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

const handleView = (id) => {
  console.log("View", id);
  // Thực hiện hành động view ở đây
};

export default {
  columns: [
    { name: "STT", align: "left" },
    { name: "name_article", align: "left" },
    { name: "content", align: "center" },
    { name: "created_date", align: "right" },
    { name: "action", align: "center" },
  ],
  rows: [
    {
      STT: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          1
        </VuiTypography>
      ),
      name_article: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          HTML
        </VuiTypography>
      ),
      content: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          HTML
        </VuiTypography>
      ),
      created_date: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          HTML
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/comment">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleView(1)}>View</button>
          </Link>
        </div>
      ),
    }
  ]
};
