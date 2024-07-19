import React, { useState } from "react";
import { faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import "./posts.css";
import Card from "../../../../components/atoms/Card/Card";
const Posts = () => {
  const [posts, setPost] = useState([
    {
      id: "HT00001",
      title: "Nam Hoàng Văn",
      author: "Nam Hoàng Vă",
      dayPost: "15-02-2021",
      status: 'Chờ duyệt',
    },
    {
      id: "HT00001",
      title: "Nam Hoàng Văn",
      author: "Nam Hoàng Vă",
      dayPost: "15-02-2021",
      status: 'Đã duyệt',
    },

  ]);

  const navigate = useNavigate()
  const handleEdit = (id) => {
    alert(`Edit member with ID ${id}`);
    navigate(`/quan-ly-bai-viet/${id}`)
  };

  const handleDelete = (id) => {
    alert(`Delete member with ID ${id}`);
  };


  return (
    <div className="member-list">
      <h2>Quản lý danh sách bài viết</h2>
      <p>
        Hiển thị danh sách bài viết, sử dụng các chức năng bên dưới để lọc theo
        mong muốn
      </p>
      <Card>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề bài viết</th>
              <th>Tác giả</th>
              <th>Ngày đăng</th>
              <th>Tình trạng</th>
              <th>Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>{post.author}</td>
                <td>{post.dayPost}</td>
                <td>{post.status}</td>
                <td>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <FontAwesomeIcon
                      icon={faEye}
                      style={{ cursor: "pointer", margin: "0 5px" }}
                      onClick={() => handleEdit(post.id)}
                    />
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      style={{ cursor: "pointer", margin: "0 5px" }}
                      onClick={() => handleDelete(post.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Posts;
