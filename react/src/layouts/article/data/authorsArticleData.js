/* eslint-disable react/prop-types */
// Vision UI Dashboard React components
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

const largeAvatarStyle = {
  width: "160px",
  height: "93.99px",
  // marginTop: "20px", 
};

function Author({ image, title, category, view, time }) {
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <VuiAvatar src={image} alt={name} size="sm" variant="rounded" style={largeAvatarStyle} />
        </div>
        <div className="col">
          <VuiBox display="flex" flexDirection="column">
            <VuiTypography variant="caption" fontWeight="medium" color="white">
              <strong>{title.toUpperCase()}</strong>
            </VuiTypography>
            <VuiTypography variant="caption" color="text">
              {category}
            </VuiTypography>
            <div className="style-scope ytd-video-meta-block" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="inline-metadata-item">73&nbsp;Tr lượt xem</span>
              <span className="inline-metadata-item style-scope ytd-video-meta-block">1 tháng trước</span>
            </div>
          </VuiBox>
        </div>
      </div>
    </div>
  );
}

function Function({ name, email }) {
  return (
    <VuiBox display="flex" flexDirection="column">
      <VuiTypography variant="button" color="white" fontWeight="medium">
        {name}
      </VuiTypography>
      <VuiTypography variant="caption" color="text">
        {email}
      </VuiTypography>
    </VuiBox>
  );
}

function Content({ content }) {
  return (
    <div>
      <p>{content.substring(0, 20)}...</p>
    </div>
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
    { name: "function", align: "left" },
    { name: "author", align: "left" },
    { name: "content", align: "left" },
    { name: "action", align: "left" },
  ],

  rows: [
    {
      ordinal: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          1
        </VuiTypography>
      ),
      function: <Author image={avatar2} title="React là gì ?" category="REACT" view="73&nbsp;Tr lượt xem" time="1 tháng trước" />,
      author: <Function name="Alexa Liras" email="alexa@simmmple.com" />,
      content: <Content content="React là một thư viện JavaScript mã nguồn mở được sử dụng để xây dựng giao diện người dùng, đặc biệt là các ứng dụng web đơn trang (Single Page Applications - SPA). React được phát triển và duy trì bởi Facebook, cùng với một cộng đồng các nhà phát triển cá nhân và công ty." />,
      action: (
        <div>
          <Link to="/formeditarticle">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(1)}>Edit</button>
          </Link>
          <Link to="/formdeletearticle">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(1)}>Delete</button>
          </Link>
        </div>
      ),
    },

  ],
};
