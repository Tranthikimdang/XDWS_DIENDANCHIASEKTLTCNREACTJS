/* eslint-disable react/prop-types */
// @mui material components
import Icon from "@mui/material/Icon";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiBadge from "components/VuiBadge";

// Images
import AdobeXD from "examples/Icons/AdobeXD";
import Atlassian from "examples/Icons/Atlassian";
import Slack from "examples/Icons/Slack";
import Spotify from "examples/Icons/Spotify";
import Jira from "examples/Icons/Jira";
// import Linkk from "assets/theme/components/link";
import { Link } from "react-router-dom";
const statusMap = {
  nháp: {
    badgeContent: "Nháp",
    color: "warning",
  },
  "đã gửi": {
    badgeContent: "Đã gửi",
    color: "success",
  },
};

const projects = [
  {
    id: "HT00001",
    sender: "Nguyễn Văn A",
    receiver: "Trần Thị B",
    content: "Thông báo về cuộc họp vào ngày mai lúc 10 giờ sáng tại phòng họp chính.",
    status: "đã gửi",
    created_date: "2024-07-20",
  },
  {
    id: "HT00002",
    sender: "Lê Văn C",
    receiver: "Nguyễn Thị D",
    content: "Cập nhật tài liệu dự án mới. Vui lòng xem tài liệu đính kèm.",
    status: "nháp",
    created_date: "2024-07-21",
  },
  {
    id: "HT00003",
    sender: "Vũ Văn E",
    receiver: "Trần Văn F",
    content: "Yêu cầu hỗ trợ kỹ thuật cho hệ thống phân tích dữ liệu.",
    status: "đã gửi",
    created_date: "2024-07-22",
  },
  {
    id: "HT00004",
    sender: "Phan Thị G",
    receiver: "Lê Văn H",
    content: "Thông báo về việc nghỉ phép của phòng nhân sự từ ngày 24 đến 26 tháng 7.",
    status: "nháp",
    created_date: "2024-07-23",
  },
  {
    id: "HT00005",
    sender: "Nguyễn Văn I",
    receiver: "Trần Thị J",
    content: "Nhắc nhở về hạn nộp báo cáo tài chính vào cuối tuần này.",
    status: "đã gửi",
    created_date: "2024-07-24",
  },
];

function BadgeComponent({ status }) {
  return (
    <VuiBadge
      variant="standard"
      badgeContent={statusMap[status]?.badgeContent || status}
      color={statusMap[status]?.color || "default"}
      size="xs"
      container
      sx={({ palette: { white, success, warning }, borders: { borderRadius, borderWidth } }) => ({
        background: status === "đã gửi" ? success.main : status === "nháp" ? warning.main : "unset",
        border: `${borderWidth[1]} solid ${
          status === "đã gửi" ? success.main : status === "nháp" ? warning.main : white.main
        }`,
        borderRadius: borderRadius.md,
        color: white.main,
      })}
    />
  );
}

export default {
  columns: [
    { name: "id", align: "left" },
    { name: "sender", align: "left" },
    { name: "receiver", align: "center" },
    { name: "content", align: "center" },
    { name: "status", align: "center" },
    { name: "created_date", align: "center" },
    { name: "action", align: "center" },
    { name: "", align: "center" },
  ],

  rows: projects.map((project) => ({
    id: project.id,
    sender: project.sender,
    receiver: project.receiver,
    content: project.content,
    status: <BadgeComponent status={project.status} />, // Custom component for displaying status
    created_date: project.created_date,
    action: (
      <div>
       {project.status === "nháp" && (
        <Link to={`/formAnnouncement`}>
          <button className="text-light btn btn-outline-info me-2" type="submit">
            Send
          </button>
        </Link>
      )}
        
      </div>
    ),
    "": (<button
      className="text-light btn btn-outline-danger"
      type="button"
      onClick={() => handleDelete(project.id)}
    >
      Delete
    </button>)
  })),
};
