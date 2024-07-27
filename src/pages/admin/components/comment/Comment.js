import React from "react";

const Comment = () => {
    return (
        <div className="container mt-5">
            <h2 className="text-danger mb-4">Quản lý bình luận </h2>
            <div className="table-responsive">
                <table className="table table-hover table-striped">
                    <thead className="table">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Username</th>
                            <th scope="col">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>John</td>
                            <td>Doe</td>
                            <td>@johndoe</td>
                            <td>johndoe@example.com</td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Jane</td>
                            <td>Smith</td>
                            <td>@janesmith</td>
                            <td>janesmith@example.com</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>William</td>
                            <td>Johnson</td>
                            <td>@williamjohnson</td>
                            <td>williamjohnson@example.com</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default Comment;