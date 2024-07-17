import React, { useState } from "react";
import { faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./MemberList.css";
const MemberList = () => {
  const [members, setMembers] = useState([
    {
      id: "HT00001",
      name: "Nam Hoàng Văn",
      phone: "0982 365 824",
      email: "chandanv1010@gmail.com",
      address: "Solforest 1 Ecopark, Văn Giang, Hưng Yên",
      group: "Administrator",
      status: true,
    },
    // Thêm thành viên khác ở đây nếu cần
  ]);

  const handleEdit = (id) => {
    alert(`Edit member with ID ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete member with ID ${id}`);
  };

  return (
    <div className="member-list">
      <h2>Quản lý danh sách thành viên</h2>
      <p>
        Hiển thị danh sách thành viên, sử dụng các chức năng bên dưới để lọc
        theo mong muốn
      </p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ Tên</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Địa chỉ</th>
            <th>Tình trạng</th>
            <th>Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.id}</td>
              <td>{member.name}</td>
              <td>{member.phone}</td>
              <td>{member.email}</td>
              <td>{member.address}</td>
              <td>
                <input type="checkbox" checked={member.status} readOnly />
              </td>
              <td>
                <div style={{display:'flex',justifyContent:'center'}}>
                  <FontAwesomeIcon
                    icon={faEye}
                    style={{ cursor: "pointer",margin:'0 5px' }}
                    onClick={() => handleEdit(member.id)}
                  />
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    style={{ cursor: "pointer",margin:'0 5px' }}
                    onClick={() => handleDelete(member.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberList;
