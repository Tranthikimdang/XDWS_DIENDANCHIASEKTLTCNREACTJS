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

function Function({ title, category }) {
  return (
    <VuiBox display="flex" flexDirection="column">
      <VuiTypography variant="caption" fontWeight="medium" color="white">
        {title}
      </VuiTypography>
      <VuiTypography variant="caption" color="text">
        {category}
      </VuiTypography>
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
    { name: "author", align: "left" },
    { name: "function", align: "left" },
    { name: "content", align: "center" },
    { name: "action", align: "center" },
  ],

  rows: [
    {
      id: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          1
        </VuiTypography>
      ),
      author: <Author image={avatar1} name="Esthera Jackson" email="esthera@simmmple.com" />,
      function: <Function title="PHP & CODE FIX" category="PHP" />,
      content: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Good!!!
        </VuiTypography>
      ),
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
    {
      id: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          2
        </VuiTypography>
      ),
      author: <Author image={avatar2} name="Alexa Liras" email="alexa@simmmple.com" />,
      function: <Function title="HTML & CODE EASY" category="PHP" />,
      content: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          nice easy code!!!
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/formeditArticle">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(1)}>Edit</button>
          </Link>
          <Link to="/formdeleteArticle">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(1)}>Delete</button>
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
      author: <Author image={avatar3} name="Laurent Michael" email="laurent@simmmple.com" />,
      function: <Function title="REACT & CODE" category="PHP" />,
      content: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          nice!!!
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/formeditArticle">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(1)}>Edit</button>
          </Link>
          <Link to="/formdeleteArticle">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(1)}>Delete</button>
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
      author: <Author image={avatar4} name="Maria James" email="maria@simmmple.com" />,
      function: <Function title="JAVASCRIPT & CODE" category="JS" />,
      content: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Excellent!!!
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/formeditArticle">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(1)}>Edit</button>
          </Link>
          <Link to="/formdeleteArticle">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(1)}>Delete</button>
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
      author: <Author image={avatar5} name="John Doe" email="john@simmmple.com" />,
      function: <Function title="PYTHON & CODE" category="Python" />,
      content: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Awesome!!!
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/formeditArticle">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(1)}>Edit</button>
          </Link>
          <Link to="/formdeleteArticle">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(1)}>Delete</button>
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
      author: <Author image={avatar6} name="Alice Wonderland" email="alice@simmmple.com" />,
      function: <Function title="JAVA & CODE" category="Java" />,
      content: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Great!!!
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/formeditArticle">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(1)}>Edit</button>
          </Link>
          <Link to="/formdeleteArticle">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(1)}>Delete</button>
          </Link>
        </div>
      ),
    },
    {
      id: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          7
        </VuiTypography>
      ),
      author: <Author image={avatar1} name="Bob Builder" email="bob@simmmple.com" />,
      function: <Function title="C++ & CODE" category="C++" />,
      content: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Superb!!!
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/formeditArticle">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(1)}>Edit</button>
          </Link>
          <Link to="/formdeleteArticle">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(1)}>Delete</button>
          </Link>
        </div>
      ),
    },
    {
      id: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          8
        </VuiTypography>
      ),
      author: <Author image={avatar2} name="Charlie Chaplin" email="charlie@simmmple.com" />,
      function: <Function title="RUBY & CODE" category="Ruby" />,
      content: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Amazing!!!
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/formeditArticle">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(1)}>Edit</button>
          </Link>
          <Link to="/formdeleteArticle">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(1)}>Delete</button>
          </Link>
        </div>
      ),
    },
    {
      id: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          9
        </VuiTypography>
      ),
      author: <Author image={avatar3} name="Dana Scully" email="dana@simmmple.com" />,
      function: <Function title="SQL & CODE" category="SQL" />,
      content: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Fantastic!!!
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/formeditArticle">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(1)}>Edit</button>
          </Link>
          <Link to="/formdeleteArticle">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(1)}>Delete</button>
          </Link>
        </div>
      ),
    },
    {
      id: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          10
        </VuiTypography>
      ),
      author: <Author image={avatar4} name="Elliot Alderson" email="elliot@simmmple.com" />,
      function: <Function title="NODEJS & CODE" category="NodeJS" />,
      content: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Awesome!!!
        </VuiTypography>
      ),
      action: (
        <div>
          <Link to="/formeditarticle">
            <button className="text-light btn btn-outline-warning me-2" type="button" onClick={() => handleEdit(1)}>Edit</button>
          </Link>
          <Link to="/formdeleteArticle">
            <button className="text-light btn btn-outline-danger" type="button" onClick={() => handleDelete(1)}>Delete</button>
          </Link>
        </div>
      ),
    },
    
  ],
};
